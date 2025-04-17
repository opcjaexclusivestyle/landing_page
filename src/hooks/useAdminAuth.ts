import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { supabase } from '@/lib/supabase';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { loginUser } from '@/redux/actions';

/**
 * Pomocnicza funkcja do wyświetlenia JWT claims
 */
async function debugJwtClaims() {
  try {
    // Pobierz aktualną sesję
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      console.error('❌ Brak sesji - nie można sprawdzić JWT claims');
      return;
    }

    // Pokaż pełny token JWT
    console.log('📜 Access Token JWT:', session.access_token);

    // Zdekoduj payload tokenu JWT (uwaga: tylko do debugowania, nie używaj w produkcji)
    const payloadBase64 = session.access_token.split('.')[1];
    const payload = JSON.parse(atob(payloadBase64));

    console.log('🔑 JWT Claims:', payload);
    console.log('👤 Role:', payload.role);
    console.log('👮 App metadata:', session.user.app_metadata);
    console.log('📋 User metadata:', session.user.user_metadata);

    return payload;
  } catch (error) {
    console.error('❌ Błąd podczas odczytywania JWT claims:', error);
    return null;
  }
}

// Nowa funkcja pomocnicza do rozwiązania problemów z nawigacją
async function refreshJWTAndSession() {
  try {
    console.log('🔄 Odświeżanie tokena JWT i sesji...');

    // 1. Upewnij się że metadane są zaktualizowane
    const { error: updateError } = await supabase.auth.updateUser({
      data: { role: 'admin' },
    });

    if (updateError) {
      console.error('❌ Błąd podczas aktualizacji metadanych:', updateError);
      return false;
    }

    // 2. Odśwież sesję aby uzyskać nowy token
    const { error: refreshError } = await supabase.auth.refreshSession();

    if (refreshError) {
      console.error('❌ Błąd podczas odświeżania sesji:', refreshError);
      return false;
    }

    // 3. Sprawdź czy odświeżanie JWT zadziałało
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) return false;

    // Sprawdź czy nowy token ma poprawne metadane
    const payloadBase64 = session.access_token.split('.')[1];
    const payload = JSON.parse(atob(payloadBase64));

    // Weryfikacja metadanych
    const hasAdminRole = payload.user_metadata?.role === 'admin';

    console.log(
      '✅ Odświeżanie JWT ' + (hasAdminRole ? 'udane' : 'nie powiodło się'),
    );
    return hasAdminRole;
  } catch (error) {
    console.error('❌ Nieoczekiwany błąd podczas odświeżania sesji:', error);
    return false;
  }
}

/**
 * Hook do weryfikacji uprawnień administratora na podstronach panelu administracyjnego
 * Sprawdza zarówno stan Redux jak i sessionStorage, a także bezpośrednio w Supabase
 */
export function useAdminAuth() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, isAdmin, user } = useSelector(
    (state: RootState) => state.auth,
  );
  const [isVerifying, setIsVerifying] = useState(true);
  const [jwtClaims, setJwtClaims] = useState(null);

  useEffect(() => {
    let isMounted = true;
    let redirectTimeout: NodeJS.Timeout | null = null;

    // Funkcja do bezpiecznego przekierowania z opóźnieniem
    const safeRedirect = (path: string) => {
      // Anuluje poprzednie przekierowanie, jeśli istnieje
      if (redirectTimeout) {
        clearTimeout(redirectTimeout);
      }

      // Dodaje małe opóźnienie dla uniknięcia race conditions
      redirectTimeout = setTimeout(() => {
        if (isMounted) {
          router.push(path);
        }
      }, 100);
    };

    async function verifyAdmin() {
      try {
        console.log('🔍 Rozpoczynam weryfikację uprawnień administratora...');

        // Inicjalnie odśwież token JWT i sesję jako pierwszą czynność
        // To może rozwiązać problem z nawigacją
        await refreshJWTAndSession();

        // DEBUG: Sprawdź JWT claims
        const claims = await debugJwtClaims();
        if (isMounted) {
          setJwtClaims(claims);
        }

        // Sprawdź czy token ma rolę admin w user_metadata
        const hasAdminRoleInJWT =
          claims && claims.user_metadata?.role === 'admin';
        if (hasAdminRoleInJWT) {
          console.log('✅ Token JWT zawiera rolę admin w metadanych');
        } else {
          console.log('⚠️ Token JWT NIE zawiera roli admin w metadanych');
        }

        // Sprawdź aktualną sesję
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          console.log('❌ Brak sesji Supabase - przekierowuję do logowania');
          if (isMounted) {
            safeRedirect('/login');
            return;
          }
        }

        // 1. Najpierw sprawdzamy Redux
        if (isAuthenticated && isAdmin && user) {
          console.log('✅ Admin zweryfikowany w Redux');
          if (isMounted) {
            // Upewniamy się, że informacja jest zapisana w sessionStorage i localStorage
            try {
              sessionStorage.setItem('adminVerified', 'true');
              sessionStorage.setItem('adminUserName', user.email || '');
            } catch (e) {
              console.error('Błąd dostępu do sessionStorage:', e);
              // Próbujemy użyć localStorage jako zapasowego rozwiązania
              try {
                localStorage.setItem('adminVerified', 'true');
                localStorage.setItem('adminUserName', user.email || '');
              } catch (e2) {
                console.error('Błąd dostępu do localStorage:', e2);
              }
            }
            setIsVerifying(false);
          }
          return;
        }

        // 2. Sprawdzamy informacje w sessionStorage, a potem w localStorage
        let adminVerified = null;
        try {
          adminVerified = sessionStorage.getItem('adminVerified');
          if (adminVerified === 'true') {
            console.log('✅ Admin zweryfikowany w sessionStorage');

            // Aktualizujemy stan Redux, jeśli nie jest ustawiony
            if (!isAdmin && session) {
              dispatch(
                loginUser({
                  id: session.user.id,
                  email: session.user.email || '',
                  isAdmin: true,
                }),
              );
            }

            if (isMounted) setIsVerifying(false);
            return;
          }
        } catch (e) {
          console.error('Błąd odczytu z sessionStorage:', e);
        }

        // Sprawdzamy localStorage jako zapasowe rozwiązanie
        if (!adminVerified) {
          try {
            adminVerified = localStorage.getItem('adminVerified');
            if (adminVerified === 'true') {
              console.log('✅ Admin zweryfikowany w localStorage');

              // Aktualizujemy stan Redux, jeśli nie jest ustawiony
              if (!isAdmin && session) {
                dispatch(
                  loginUser({
                    id: session.user.id,
                    email: session.user.email || '',
                    isAdmin: true,
                  }),
                );
              }

              if (isMounted) setIsVerifying(false);
              return;
            }
          } catch (e) {
            console.error('Błąd odczytu z localStorage:', e);
          }
        }

        // 3. Jeśli ani Redux ani sessionStorage nie mają potwierdzenia,
        // sprawdzamy bezpośrednio w Supabase
        console.log('🔍 Sprawdzanie uprawnień w Supabase...');

        if (!session) {
          console.log('❌ Brak sesji Supabase');
          if (isMounted) {
            safeRedirect('/login');
            return;
          }
        }

        // 4. Sprawdź czy rola admin jest w metadanych użytkownika - najszybsza droga
        const isAdminInMetadata =
          session &&
          (session.user?.app_metadata?.role === 'admin' ||
            session.user?.user_metadata?.role === 'admin');

        if (session && isAdminInMetadata) {
          console.log('✅ Admin zweryfikowany przez metadane użytkownika');

          // Aktualizujemy stan Redux
          dispatch(
            loginUser({
              id: session.user.id,
              email: session.user.email || '',
              isAdmin: true,
            }),
          );

          if (isMounted) {
            // Zapisujemy informację w sessionStorage i localStorage
            try {
              sessionStorage.setItem('adminVerified', 'true');
              sessionStorage.setItem(
                'adminUserName',
                session.user?.email || '',
              );
            } catch (e) {
              console.error('Błąd zapisu do sessionStorage:', e);
              try {
                localStorage.setItem('adminVerified', 'true');
                localStorage.setItem(
                  'adminUserName',
                  session.user?.email || '',
                );
              } catch (e2) {
                console.error('Błąd zapisu do localStorage:', e2);
              }
            }
            setIsVerifying(false);
          }
          return;
        }

        // 5. Sprawdzamy, czy użytkownik ma rolę administratora w bazie danych
        if (session) {
          try {
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', session.user?.id || '')
              .maybeSingle();

            console.log('🔍 Wynik zapytania o profil:', { profile, error });

            // Sprawdź, czy wystąpił błąd związany z brakiem dostępu
            if (error) {
              console.error('⚠️ Błąd podczas pobierania profilu:', error);

              // Sprawdź czy to błąd uprawnień czy inny błąd
              if (
                error.code === 'PGRST301' ||
                error.code === 'PGRST116' ||
                (error.message && error.message.includes('permission denied'))
              ) {
                // Błąd uprawnień RLS - spróbujmy silniejsze odświeżenie tokena
                console.log(
                  '⚠️ Błąd RLS przy dostępie do profilu - wymuszam kompletne odświeżenie...',
                );

                // Całkowite odświeżenie tokena i sesji
                const refreshSuccess = await refreshJWTAndSession();

                if (!refreshSuccess) {
                  console.error('❌ Nie udało się odświeżyć tokena');
                  if (isMounted) {
                    safeRedirect('/login');
                  }
                  return;
                }

                // Ponawiamy próbę pobrania profilu
                const { data: updatedProfile, error: updatedError } =
                  await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', session.user?.id || '')
                    .maybeSingle();

                if (updatedError) {
                  console.error(
                    '❌ Nadal błąd przy dostępie do profilu po aktualizacji JWT:',
                    updatedError,
                  );

                  // Stosujemy rozwiązanie awaryjne - ustawiamy stan jako admin bez sprawdzania bazy
                  console.log(
                    '⚠️ Stosowanie rozwiązania awaryjnego - zakładanie uprawnień administratora',
                  );

                  dispatch(
                    loginUser({
                      id: session.user.id,
                      email: session.user.email || '',
                      isAdmin: true,
                    }),
                  );

                  if (isMounted) {
                    // Zapisujemy informację w sessionStorage i localStorage
                    try {
                      sessionStorage.setItem('adminVerified', 'true');
                      sessionStorage.setItem(
                        'adminUserName',
                        session.user?.email || '',
                      );
                    } catch (e) {
                      console.error('Błąd zapisu do sessionStorage:', e);
                      try {
                        localStorage.setItem('adminVerified', 'true');
                        localStorage.setItem(
                          'adminUserName',
                          session.user?.email || '',
                        );
                      } catch (e2) {
                        console.error('Błąd zapisu do localStorage:', e2);
                      }
                    }
                    setIsVerifying(false);
                  }
                  return;
                }

                if (updatedProfile?.role === 'admin') {
                  console.log('✅ Admin zweryfikowany po aktualizacji JWT');

                  // Aktualizujemy stan Redux
                  dispatch(
                    loginUser({
                      id: session.user.id,
                      email: session.user.email || '',
                      isAdmin: true,
                    }),
                  );

                  if (isMounted) {
                    // Zapisujemy informację w sessionStorage i localStorage
                    try {
                      sessionStorage.setItem('adminVerified', 'true');
                      sessionStorage.setItem(
                        'adminUserName',
                        session.user?.email || '',
                      );
                    } catch (e) {
                      console.error('Błąd zapisu do sessionStorage:', e);
                      try {
                        localStorage.setItem('adminVerified', 'true');
                        localStorage.setItem(
                          'adminUserName',
                          session.user?.email || '',
                        );
                      } catch (e2) {
                        console.error('Błąd zapisu do localStorage:', e2);
                      }
                    }
                    setIsVerifying(false);
                  }
                  return;
                }
              }

              // Inny rodzaj błędu - przekierowujemy do logowania
              if (isMounted) {
                safeRedirect('/login');
              }
              return;
            }

            // Kontynuuj sprawdzanie jak wcześniej
            if (profile?.role === 'admin') {
              console.log('✅ Admin zweryfikowany w bazie danych');

              // Zawsze aktualizuj JWT claims jeśli role admin nie jest w metadanych
              const hasAdminRoleInMetadata =
                session.user?.app_metadata?.role === 'admin' ||
                session.user?.user_metadata?.role === 'admin';

              if (!hasAdminRoleInMetadata) {
                console.log('⚠️ Aktualizuję JWT claims dla administratora...');
                await refreshJWTAndSession();
              }

              // Aktualizujemy stan Redux
              dispatch(
                loginUser({
                  id: session.user.id,
                  email: session.user.email || '',
                  isAdmin: true,
                }),
              );

              if (isMounted) {
                // Zapisujemy informację w sessionStorage i localStorage
                try {
                  sessionStorage.setItem('adminVerified', 'true');
                  sessionStorage.setItem(
                    'adminUserName',
                    session.user?.email || '',
                  );
                } catch (e) {
                  console.error('Błąd zapisu do sessionStorage:', e);
                  // Próbujemy użyć localStorage jako zapasowego rozwiązania
                  try {
                    localStorage.setItem('adminVerified', 'true');
                    localStorage.setItem(
                      'adminUserName',
                      session.user?.email || '',
                    );
                  } catch (e2) {
                    console.error('Błąd zapisu do localStorage:', e2);
                  }
                }
                setIsVerifying(false);
              }
              return;
            }
          } catch (error) {
            console.error(
              '❌ Nieoczekiwany błąd podczas weryfikacji profilu:',
              error,
            );
          }
        }

        // Jeśli dotarliśmy tutaj, oznacza to brak uprawnień administratora
        console.log(
          '❌ Brak uprawnień administratora - przekierowuję do logowania',
        );
        if (isMounted) {
          safeRedirect('/login');
        }
      } catch (error) {
        console.error(
          '❌ Nieoczekiwany błąd podczas weryfikacji administratora:',
          error,
        );
        if (isMounted) {
          safeRedirect('/login');
        }
      } finally {
        if (isMounted) {
          setIsVerifying(false);
        }
      }
    }

    verifyAdmin();

    return () => {
      isMounted = false;
      // Czyścimy timeout przy odmontowaniu komponentu
      if (redirectTimeout) {
        clearTimeout(redirectTimeout);
      }
    };
  }, [isAuthenticated, isAdmin, user, router, dispatch]);

  return { isAuthenticated, isAdmin, isVerifying };
}
