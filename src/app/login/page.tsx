'use client';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { useState, FormEvent, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { setAuthLoading, loginUser, logoutUser } from '@/redux/actions';

export default function Login() {
  const router = useRouter();
  // Zawsze przekierowujemy na /admin, pomijamy parametr returnUrl
  const returnUrl = '/admin';

  const dispatch = useAppDispatch();
  const {
    isAuthenticated,
    isAdmin,
    loading: authLoading,
  } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  // Wydzielenie logiki przekierowania do osobnej funkcji
  const redirectIfAuthenticated = useCallback(() => {
    if (!checkingSession && isAuthenticated && isAdmin) {
      // Bezpośrednie przekierowanie na /admin
      router.push('/admin');
    }
  }, [isAuthenticated, isAdmin, checkingSession, router]);

  // Sprawdzamy sesję tylko raz przy montowaniu komponentu
  useEffect(() => {
    let isMounted = true;

    async function checkSession() {
      if (!isMounted) return;

      console.log('Sprawdzanie istniejącej sesji...');
      try {
        // Sprawdzamy sesję Supabase
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('Błąd sesji:', sessionError);
          if (isMounted) {
            setDebugInfo(`Błąd sesji: ${sessionError.message}`);
            dispatch(logoutUser());
          }
          return;
        }

        if (!isMounted) return;

        if (session) {
          console.log('Znaleziono sesję, sprawdzanie profilu...');
          // Sprawdzamy, czy użytkownik ma rolę administratora
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .maybeSingle();

          if (!isMounted) return;

          if (profileError) {
            console.error('Błąd profilu:', profileError);
            setDebugInfo(`Błąd profilu: ${profileError.message}`);
            dispatch(logoutUser());
            setError('Błąd podczas pobierania profilu');
          } else if (!profile) {
            console.log('Nie znaleziono profilu, tworzenie nowego...');
            // Jeśli profil nie istnieje, tworzymy go
            const { error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: session.user.id,
                role: 'user', // Domyślnie każdy nowy użytkownik ma rolę 'user'
              });

            if (insertError) {
              console.error('Błąd tworzenia profilu:', insertError);
              setDebugInfo(`Błąd tworzenia profilu: ${insertError.message}`);
              dispatch(logoutUser());
              setError('Nie udało się utworzyć profilu użytkownika');
            } else {
              dispatch(logoutUser());
              setError('Nie masz uprawnień do panelu administratora');
            }
          } else if (profile.role === 'admin') {
            console.log('Profil administratora potwierdzony');
            // Aktualizujemy stan Redux
            dispatch(
              loginUser({
                id: session.user.id,
                email: session.user.email || '',
                isAdmin: true,
              }),
            );
          } else {
            console.log('Użytkownik nie jest administratorem');
            dispatch(logoutUser());
            setError('Nie masz uprawnień do panelu administratora');
          }
        } else {
          console.log('Brak sesji');
          dispatch(logoutUser());
        }
      } catch (err) {
        console.error('Nieoczekiwany błąd:', err);
        if (!isMounted) return;
        if (err instanceof Error) {
          setDebugInfo(`Nieoczekiwany błąd: ${err.message}`);
        }
        dispatch(logoutUser());
      } finally {
        if (isMounted) {
          setCheckingSession(false);
        }
      }
    }

    checkSession();

    // Funkcja czyszcząca dla useEffect
    return () => {
      isMounted = false;
    };
  }, []); // Pusta tablica zależności - efekt uruchamiany tylko raz

  // Ten efekt sprawdza stan autoryzacji i przekierowuje jeśli trzeba
  useEffect(() => {
    redirectIfAuthenticated();
  }, [redirectIfAuthenticated]); // Stabilna zależność dzięki useCallback

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setDebugInfo(null);
    setLoading(true);
    dispatch(setAuthLoading(true));

    try {
      console.log(`Próba logowania dla: ${email}`);
      // Logowanie użytkownika
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError) {
        console.error('Błąd logowania:', signInError);
        setDebugInfo(`Błąd logowania: ${signInError.message}`);
        throw signInError;
      }

      if (data?.user) {
        console.log('Logowanie udane, sprawdzanie profilu...');

        // DEBUG: Sprawdź JWT claims po zalogowaniu
        try {
          const {
            data: { session },
          } = await supabase.auth.getSession();
          if (session) {
            console.log(
              '📜 Access Token JWT po zalogowaniu:',
              session.access_token,
            );

            // Zdekoduj payload tokenu JWT (uwaga: tylko do debugowania)
            const payloadBase64 = session.access_token.split('.')[1];
            const payload = JSON.parse(atob(payloadBase64));

            console.log('🔑 JWT Claims po zalogowaniu:', payload);
            console.log('👤 Role w JWT:', payload.role);
            console.log(
              '👮 App metadata użytkownika:',
              session.user.app_metadata,
            );
            console.log(
              '📋 User metadata użytkownika:',
              session.user.user_metadata,
            );

            // Sprawdź uprawnienia w JWT
            if (
              payload.role === 'authenticated' &&
              !payload.role.includes('admin')
            ) {
              console.log(
                '⚠️ JWT nie zawiera roli admin - to może być przyczyną problemów z dostępem',
              );
            }
          }
        } catch (e) {
          console.error('❌ Błąd podczas odczytywania JWT claims:', e);
        }

        // Sprawdzamy, czy użytkownik ma rolę administratora
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .maybeSingle();

        if (profileError) {
          console.error('Błąd profilu:', profileError);
          setDebugInfo(`Błąd profilu: ${profileError.message}`);

          // Sprawdzamy czy to błąd związany z uprawnieniami
          if (
            profileError.code === 'PGRST301' ||
            profileError.code === 'PGRST116' ||
            (profileError.message &&
              profileError.message.includes('permission denied'))
          ) {
            console.log('Błąd uprawnień - sprawdzamy metadane użytkownika');

            // Spróbuj sprawdzić uprawnienia przez metadane użytkownika
            const {
              data: { user: currentUser },
            } = await supabase.auth.getUser();

            // Sprawdź czy rola jest zapisana w metadanych
            const isAdminInMetadata =
              currentUser?.app_metadata?.role === 'admin' ||
              currentUser?.user_metadata?.role === 'admin';

            if (isAdminInMetadata) {
              console.log('Admin zweryfikowany przez metadane');

              // Zapisujemy informacje o zalogowanym użytkowniku w Redux
              dispatch(
                loginUser({
                  id: data.user.id,
                  email: data.user.email || '',
                  isAdmin: true,
                }),
              );

              // Zapisujemy informację o weryfikacji w pamięci przeglądarki
              try {
                sessionStorage.setItem('adminVerified', 'true');
                sessionStorage.setItem('adminUserName', data.user.email || '');
                localStorage.setItem('adminVerified', 'true');
                localStorage.setItem('adminUserName', data.user.email || '');
              } catch (e) {
                console.error('Błąd zapisu do pamięci przeglądarki:', e);
              }

              router.push('/admin');
              return;
            }
          }

          throw profileError;
        }

        // Jeśli profil nie istnieje, tworzymy go
        if (!profile) {
          console.log('Profil nie istnieje, tworzenie nowego...');
          // Tworzymy nowy profil dla użytkownika
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              role: 'user', // Domyślnie każdy nowy użytkownik ma rolę 'user'
            });

          if (insertError) {
            console.error('Błąd tworzenia profilu:', insertError);
            setDebugInfo(`Błąd tworzenia profilu: ${insertError.message}`);
            throw insertError;
          }

          // Użytkownik nie ma uprawnień administratora
          setError('Nie masz uprawnień do panelu administratora');
          await supabase.auth.signOut();
          dispatch(logoutUser());
          return;
        }

        if (profile.role === 'admin') {
          console.log('Użytkownik jest administratorem');

          // Automatycznie aktualizuj JWT claims dla admina
          try {
            console.log(
              'Automatyczna aktualizacja JWT claims dla administratora...',
            );
            const { error: updateError } = await supabase.auth.updateUser({
              data: { role: 'admin' }, // Dodajemy rolę admin do metadanych użytkownika
            });

            if (updateError) {
              console.error(
                'Błąd podczas aktualizacji metadanych:',
                updateError,
              );
            } else {
              // Odśwież sesję, aby uzyskać nowy token z zaktualizowanymi claims
              const { error: refreshError } =
                await supabase.auth.refreshSession();
              if (refreshError) {
                console.error('Błąd podczas odświeżania sesji:', refreshError);
              } else {
                console.log('JWT claims zaktualizowane pomyślnie');
              }
            }
          } catch (e) {
            console.error('Błąd podczas aktualizacji JWT claims:', e);
          }

          // Zapisujemy informacje o zalogowanym użytkowniku w Redux
          dispatch(
            loginUser({
              id: data.user.id,
              email: data.user.email || '',
              isAdmin: true,
            }),
          );

          // Zapisujemy informację o weryfikacji admina w sessionStorage i localStorage
          try {
            sessionStorage.setItem('adminVerified', 'true');
            sessionStorage.setItem('adminUserName', data.user.email || '');
          } catch (e) {
            console.error('Błąd zapisu do sessionStorage:', e);
          }

          // Dodatkowo zapisujemy w localStorage jako zapasowe rozwiązanie
          try {
            localStorage.setItem('adminVerified', 'true');
            localStorage.setItem('adminUserName', data.user.email || '');
          } catch (e) {
            console.error('Błąd zapisu do localStorage:', e);
          }

          // Jeśli jest administratorem, przekierowujemy bezpośrednio na /admin
          router.push('/admin');
        } else {
          console.log('Użytkownik nie jest administratorem');
          // Usuwamy ewentualne poprzednie dane admina z sessionStorage i localStorage
          try {
            sessionStorage.removeItem('adminVerified');
            sessionStorage.removeItem('adminUserName');
            localStorage.removeItem('adminVerified');
            localStorage.removeItem('adminUserName');
          } catch (e) {
            console.error('Błąd podczas czyszczenia danych przeglądarki:', e);
          }
          // Jeśli nie jest administratorem, wyświetlamy błąd
          setError('Nie masz uprawnień do panelu administratora');
          // Wylogowujemy użytkownika
          await supabase.auth.signOut();
          dispatch(logoutUser());
        }
      }
    } catch (err: any) {
      console.error('Błąd ogólny:', err);
      setError(err.message || 'Wystąpił błąd podczas logowania');
      dispatch(logoutUser());
    } finally {
      setLoading(false);
      dispatch(setAuthLoading(false));
    }
  };

  // Jeśli sprawdzamy sesję, pokazujemy loader
  if (checkingSession) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='w-12 h-12 border-4 border-t-[var(--gold)] border-gray-200 rounded-full animate-spin'></div>
      </div>
    );
  }

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8'>
      <div className='w-full max-w-md space-y-8'>
        <div>
          <h2 className='mt-6 text-center text-3xl font-bold tracking-tight text-gray-900'>
            Panel administratora
          </h2>
          <p className='mt-2 text-center text-sm text-gray-600'>
            Zaloguj się, aby uzyskać dostęp
          </p>
        </div>

        {error && (
          <div className='rounded-md bg-red-50 p-4'>
            <div className='flex'>
              <div className='flex-shrink-0'>
                <svg
                  className='h-5 w-5 text-red-400'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
              <div className='ml-3'>
                <p className='text-sm font-medium text-red-800'>{error}</p>
              </div>
            </div>
          </div>
        )}

        {debugInfo && process.env.NODE_ENV === 'development' && (
          <div className='rounded-md bg-yellow-50 p-4'>
            <div className='flex'>
              <div className='flex-shrink-0'>
                <svg
                  className='h-5 w-5 text-yellow-400'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path
                    fillRule='evenodd'
                    d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1v-3a1 1 0 00-1-1z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
              <div className='ml-3'>
                <p className='text-sm font-medium text-yellow-800'>
                  {debugInfo}
                </p>
              </div>
            </div>
          </div>
        )}

        <form className='mt-8 space-y-6' onSubmit={handleLogin}>
          <div className='-space-y-px rounded-md shadow-sm'>
            <div>
              <label htmlFor='email-address' className='sr-only'>
                Adres email
              </label>
              <input
                id='email-address'
                name='email'
                type='email'
                autoComplete='email'
                required
                className='relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-[var(--gold)] sm:text-sm sm:leading-6'
                placeholder='Adres email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor='password' className='sr-only'>
                Hasło
              </label>
              <input
                id='password'
                name='password'
                type='password'
                autoComplete='current-password'
                required
                className='relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-[var(--gold)] sm:text-sm sm:leading-6'
                placeholder='Hasło'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type='submit'
              disabled={loading}
              className='group relative flex w-full justify-center rounded-md bg-[var(--gold)] px-3 py-2 text-sm font-semibold text-white hover:bg-[var(--gold-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold)] disabled:opacity-70'
            >
              {loading ? (
                <span className='absolute inset-y-0 left-0 flex items-center pl-3'>
                  <svg
                    className='h-5 w-5 animate-spin text-white'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                  >
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                    ></circle>
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                    ></path>
                  </svg>
                </span>
              ) : null}
              Zaloguj się
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
