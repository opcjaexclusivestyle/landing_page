import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Dodajemy szczegółowe logowanie początku middleware z informacją o ścieżce
  console.log('🔶 Middleware uruchomione dla:', request.nextUrl.pathname);
  console.log('🔶 Pełny URL:', request.url);
  console.log('🔶 Method:', request.method);

  // Przechwytujemy zapytania API, które mogą być związane z zasobami admin
  if (request.nextUrl.pathname.includes('/api/')) {
    console.log('🔶 Zapytanie API - pomijam sprawdzanie sesji');
    return NextResponse.next();
  }

  // Tworzymy odpowiedź
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Tworzymy klienta Supabase z żądania
  console.log('🔶 Tworzenie klienta Supabase...');
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const value = request.cookies.get(name)?.value;
          console.log(
            `🔶 Odczytano cookie ${name}:`,
            value ? 'wartość istnieje' : 'brak wartości',
          );
          return value;
        },
        set(name: string, value: string, options) {
          console.log(`🔶 Ustawiono cookie ${name} z opcjami:`, options);
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options) {
          console.log(`🔶 Usunięto cookie ${name}`);
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    },
  );

  try {
    console.log('🔶 Pobieranie sesji użytkownika...');
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error('🔶 Błąd podczas pobierania sesji:', sessionError.message);
      // W przypadku błędu sesji, jeśli użytkownik próbuje wejść do panelu admin,
      // przekierowujemy na stronę logowania
      if (request.nextUrl.pathname.startsWith('/admin')) {
        console.log('🔶 Przekierowanie na login z powodu błędu sesji');
        // Używamy pełnej ścieżki bez parametrów do przekierowania
        return NextResponse.redirect(new URL('/login', request.url));
      }
      return response;
    }

    console.log(
      '🔶 Sesja:',
      session ? `Zalogowany jako ${session.user.email}` : 'Brak sesji',
    );

    // Jeśli ścieżka to /admin lub /admin/* i użytkownik nie jest zalogowany, przekieruj na stronę logowania
    if (!session && request.nextUrl.pathname.startsWith('/admin')) {
      console.log('🔶 Brak sesji, przekierowuję na stronę logowania');
      // Przekierowanie na login bez dodawania parametrów returnUrl
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Jeśli użytkownik jest zalogowany i próbuje wejść do panelu admin,
    // sprawdzamy czy ma rolę administratora
    if (session && request.nextUrl.pathname.startsWith('/admin')) {
      console.log(
        '🔶 Sprawdzanie uprawnień administratora dla:',
        session.user.email,
        'na ścieżce:',
        request.nextUrl.pathname,
      );

      // Sprawdź, czy użytkownik ma zapisane uprawnienia administratora w cookie
      const adminVerified = request.cookies.get('adminVerified')?.value;
      if (adminVerified === 'true') {
        console.log('🔶 Użytkownik zweryfikowany jako admin przez cookies');
        console.log(
          '🔶 Admin verification passed for path:',
          request.nextUrl.pathname,
        );
        return response;
      }

      // Sprawdź metadane użytkownika w JWT
      console.log('🔶 Sprawdzam metadane użytkownika w JWT...');

      // Wypisz pełne metadata dla debugowania
      console.log('🔶 User metadata:', session.user.user_metadata);
      console.log('🔶 App metadata:', session.user.app_metadata);

      const isAdminInUserMetadata =
        session.user.user_metadata?.role === 'admin';
      const isAdminInAppMetadata = session.user.app_metadata?.role === 'admin';

      if (isAdminInUserMetadata || isAdminInAppMetadata) {
        console.log('🔶 Użytkownik ma rolę admin w metadanych JWT');

        // Ustawiamy cookie, żeby nie musieć za każdym razem sprawdzać
        response.cookies.set({
          name: 'adminVerified',
          value: 'true',
          path: '/', // Upewniamy się, że cookie będzie dostępne na wszystkich ścieżkach
          maxAge: 60 * 60 * 24 * 7, // 7 dni
          httpOnly: true, // Tylko dla HTTP
          secure: process.env.NODE_ENV === 'production', // Secure tylko na produkcji
          sameSite: 'lax', // Umożliwia przekazywanie cookie przy nawigacji z zewnętrznych stron
        });

        console.log(
          '🔶 Admin verification via JWT passed for path:',
          request.nextUrl.pathname,
        );
        return response;
      }

      try {
        // Pobieramy profil użytkownika, aby sprawdzić jego rolę
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .maybeSingle();

        console.log('🔶 Profil użytkownika:', profile, 'Błąd:', error);

        // Jeśli wystąpił błąd podczas pobierania profilu
        if (error) {
          console.error(
            '🔶 Błąd podczas pobierania profilu:',
            error.message,
            error.code,
          );

          // Tworzymy nowy profil dla użytkownika, jeśli wystąpił błąd "nie znaleziono"
          if (error.code === 'PGRST116') {
            console.log('🔶 Tworzenie nowego profilu...');
            const { error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: session.user.id,
                role: 'user', // Domyślnie użytkownik jest zwykłym użytkownikiem
              });

            if (insertError) {
              console.error(
                '🔶 Błąd podczas tworzenia profilu:',
                insertError.message,
              );
            } else {
              console.log('🔶 Utworzono nowy profil z rolą "user"');
            }
          }

          // W przypadku błędu sprawdzamy jeszcze metadane użytkownika jako ostatnią deskę ratunku
          if (isAdminInUserMetadata || isAdminInAppMetadata) {
            console.log(
              '🔶 Po błędzie bazy danych, weryfikuję przez metadane JWT',
            );

            // Ustawiamy cookie, żeby nie musieć za każdym razem sprawdzać
            response.cookies.set({
              name: 'adminVerified',
              value: 'true',
              path: '/', // Upewniamy się, że cookie będzie dostępne na wszystkich ścieżkach
              maxAge: 60 * 60 * 24 * 7, // 7 dni
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
            });

            console.log(
              '🔶 Admin verification via JWT (after DB error) passed for path:',
              request.nextUrl.pathname,
            );
            return response;
          }

          // Rozwiązanie awaryjne - jeśli strona jest dostępna bez dodatkowych sprawdzeń
          // (np. dashboard), przepuszczamy użytkownika
          if (request.nextUrl.pathname === '/admin') {
            console.log(
              '🔶 Awaryjne zezwolenie na dostęp do głównej strony admina',
            );
            return response;
          }

          // W przypadku błędu przekierowujemy na stronę główną admina
          console.log('🔶 Przekierowanie na /admin z powodu błędu profilu');
          return NextResponse.redirect(new URL('/admin', request.url));
        }

        // Jeśli użytkownik nie ma profilu lub nie ma roli administratora
        if (!profile || profile.role !== 'admin') {
          // Jeszcze raz sprawdzamy metadane jako ostatnią szansę
          if (isAdminInUserMetadata || isAdminInAppMetadata) {
            console.log('🔶 Brak profilu admin w bazie, ale znaleziono w JWT');

            // Ustawiamy cookie, żeby nie musieć za każdym razem sprawdzać
            response.cookies.set({
              name: 'adminVerified',
              value: 'true',
              path: '/', // Upewniamy się, że cookie będzie dostępne na wszystkich ścieżkach
              maxAge: 60 * 60 * 24 * 7, // 7 dni
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
            });

            // Próba naprawienia profilu w bazie danych
            try {
              const { error: updateError } = await supabase
                .from('profiles')
                .update({ role: 'admin' })
                .eq('id', session.user.id);

              if (!updateError) {
                console.log('🔶 Zaktualizowano profil w bazie na admin');
              } else {
                console.error(
                  '🔶 Błąd podczas aktualizacji profilu:',
                  updateError,
                );
              }
            } catch (e) {
              console.error('🔶 Błąd podczas aktualizacji profilu:', e);
            }

            console.log(
              '🔶 Admin verification via JWT (no admin in DB) passed for path:',
              request.nextUrl.pathname,
            );
            return response;
          }

          // Jeśli nie znaleziono uprawnień administratora, przekierowujemy na stronę główną
          console.log(
            '🔶 Użytkownik nie jest administratorem, przekierowuję na stronę główną',
          );
          return NextResponse.redirect(new URL('/', request.url));
        }

        console.log('🔶 Użytkownik jest administratorem, kontynuuję...');

        // Ustawiamy cookie, żeby nie musieć za każdym razem sprawdzać
        response.cookies.set({
          name: 'adminVerified',
          value: 'true',
          path: '/', // Upewniamy się, że cookie będzie dostępne na wszystkich ścieżkach
          maxAge: 60 * 60 * 24 * 7, // 7 dni
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
        });

        // Dodajemy specjalny nagłówek do odpowiedzi, informujący o roli administratora
        // To może pomóc w debugowaniu problemów z autoryzacją
        response.headers.set('X-User-Role', 'admin');

        console.log(
          '🔶 Admin verification via DB passed for path:',
          request.nextUrl.pathname,
        );
        return response;
      } catch (err) {
        console.error(
          '🔶 Nieoczekiwany błąd podczas sprawdzania uprawnień:',
          err,
        );

        // Awaryjnie sprawdzamy metadane JWT
        if (isAdminInUserMetadata || isAdminInAppMetadata) {
          console.log('🔶 Po wyjątku, weryfikuję przez metadane JWT');

          response.cookies.set({
            name: 'adminVerified',
            value: 'true',
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
          });

          console.log(
            '🔶 Admin verification via JWT (after exception) passed for path:',
            request.nextUrl.pathname,
          );
          return response;
        }

        return NextResponse.redirect(new URL('/admin', request.url));
      }
    }

    console.log('🔶 Middleware zakończone pomyślnie');
    return response;
  } catch (error) {
    console.error('🔶 Błąd w middleware:', error);
    return response;
  }
}

// Konfiguracja, które ścieżki powinny być obsługiwane przez middleware
export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
