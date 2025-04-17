# Migracja bazy danych dla systemu logowania

Ten katalog zawiera skrypty migracyjne dla bazy danych Supabase.

## Instalacja tabeli profiles

Aby poprawnie skonfigurować system autoryzacji, należy wykonać następujące kroki:

1. Zaloguj się do panelu Supabase (https://app.supabase.com)
2. Wybierz swój projekt
3. Przejdź do SQL Editor (zakładka "SQL" w menu bocznym)
4. Skopiuj i wklej zawartość pliku `create_profiles_table.sql`
5. Wykonaj zapytanie

## Dodawanie uprawnień administratora

Aby nadać uprawnienia administratora dla istniejącego użytkownika, wykonaj poniższe zapytanie:

```sql
INSERT INTO profiles (id, role)
VALUES ('UUID_UŻYTKOWNIKA', 'admin')
ON CONFLICT (id) DO UPDATE SET role = 'admin';
```

Gdzie `UUID_UŻYTKOWNIKA` to identyfikator użytkownika w Supabase Auth.

## Rozwiązywanie problemów

Jeśli masz problemy z logowaniem do panelu administracyjnego, upewnij się że:

1. Użytkownik istnieje w tabeli `auth.users`
2. Użytkownik ma wpis w tabeli `profiles` z rolą `admin`
3. W aplikacji używasz prawidłowego adresu e-mail i hasła
4. Sesja użytkownika jest prawidłowo obsługiwana przez middleware

## Dodanie polityki RLS

Aby zapewnić, że tylko administratorzy mogą wykonywać operacje na tabeli `profiles`, dodajemy nową politykę RLS:

```sql
ALTER POLICY "Admins can do everything"
  ON profiles
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );
```

## Rozwiązywanie problemów z nawigacją w panelu administratora

Jeśli po zalogowaniu do panelu administratora nie możesz nawigować między podstronami (np. nie działają linki w menu), możliwe przyczyny i rozwiązania to:

### 1. Problem z JWT claims

Twoje uprawnienia administratora mogą być zapisane w JWT, ale polityka RLS nie odczytuje ich poprawnie. Wykonaj następujące polecenie SQL:

```sql
ALTER POLICY "Admins can do everything"
  ON profiles
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );
```

Powtórz to dla wszystkich tabel, które mają polityki RLS dla administratorów:

```sql
-- Dla tabeli orders
ALTER POLICY "Admins can do everything"
  ON orders
  USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- Dla tabeli products
ALTER POLICY "Admins can do everything"
  ON products
  USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');
```

### 2. Problem z ciasteczkami

Middleware może niepoprawnie ustawiać ciasteczka, co powoduje, że Twój status administratora nie jest zapamiętywany między podstronami. Rozwiązania:

1. Wyczyść ciasteczka dla strony
2. Wyloguj się i zaloguj ponownie
3. Upewnij się, że middleware ustawia ciasteczko `adminVerified=true`

### 3. Weryfikacja uprawnień w przeglądarce

Możesz sprawdzić swoje aktualne uprawnienia używając konsoli przeglądarki:

```javascript
// Sprawdź ciasteczka
document.cookie;

// Sprawdź localStorage
localStorage.getItem('adminVerified');
```

Jeśli problemy z nawigacją nadal występują, spróbuj uruchomić aplikację w trybie produkcyjnym:

```bash
npm run build
npm start
```
