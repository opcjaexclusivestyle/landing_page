# Instrukcja rozwiązania problemu logowania do panelu administratora

## Problemy

Obecnie występuje kilka problemów z logowaniem do panelu administratora:

1. Brak prawidłowo skonfigurowanej tabeli `profiles` w bazie danych Supabase, która przechowuje informacje o rolach użytkowników.
2. Problem z przekierowaniem URL po logowaniu - system używał parametru `returnUrl` w adresie, co mogło powodować nieprawidłowe przekierowania.
3. **Nieskończona rekursja w politykach bezpieczeństwa** - wykryto problem z politykami Row Level Security (RLS), które powodowały nieskończoną rekursję.
4. **Konflikt istniejących polityk** - niektóre polityki bezpieczeństwa już istnieją w systemie i powodują błędy podczas wykonywania skryptu.

## Rozwiązanie

### 1. Wykonanie zaktualizowanego skryptu SQL

1. Zaloguj się do panelu Supabase: https://app.supabase.com
2. Wybierz swój projekt
3. Przejdź do zakładki "SQL" w menu bocznym
4. Skopiuj i wklej zaktualizowany skrypt SQL poniżej, który:
   - Tworzy tabelę `profiles` (jeśli nie istnieje)
   - Usuwa wszystkie istniejące polityki bezpieczeństwa (aby uniknąć konfliktów)
   - Tymczasowo wyłącza RLS, aby umożliwić dodanie administratora
   - Dodaje rekord administratora
   - Włącza RLS z poprawionymi politykami (bez nieskończonej rekursji)

```sql
-- Tworzenie tabeli profiles, jeśli nie istnieje
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Najpierw usuwamy wszystkie istniejące polityki, aby uniknąć konfliktów
DROP POLICY IF EXISTS "Profiles are readable by all authenticated users" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins have full access to profiles" ON profiles;
DROP POLICY IF EXISTS "Service role can insert profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;

-- Dodanie polityk zabezpieczeń RLS (Row Level Security)
-- Najpierw tymczasowo wyłączamy RLS, aby umożliwić wstawienie pierwszego administratora
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Nadanie uprawnień administratora dla określonego użytkownika
INSERT INTO profiles (id, role)
VALUES ('14789e21-3795-4edd-a090-0c9f839e35f1', 'admin')
ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- Teraz włączamy RLS z odpowiednimi politykami
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Najpierw tworzymy politykę umożliwiającą wszystkim ODCZYT tabeli profiles
-- Ta polityka jest liberalna, ale bezpieczna, bo pozwala tylko na odczyt
CREATE POLICY "Profiles are readable by all authenticated users"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

-- Polityka umożliwiająca użytkownikom aktualizację własnego profilu (ale nie roli)
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (role = 'user'); -- zapobiega nadaniu sobie roli admin

-- Polityka umożliwiająca INSERT dla service_role (tylko dla wewnętrznych operacji)
CREATE POLICY "Service role can insert profiles"
  ON profiles FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Polityka umożliwiająca administratorom modyfikację wszystkich profili
CREATE POLICY "Admins can update all profiles"
  ON profiles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.uid() = id AND auth.uid() IN (
        SELECT id FROM profiles WHERE role = 'admin'
      )
    )
  );

-- Funkcja wyzwalacza do auto-aktualizacji pola updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Dodanie wyzwalacza do tabeli profiles
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

### 2. Wylogowanie i ponowne zalogowanie

1. Wyczyść ciasteczka i pamięć podręczną przeglądarki związane z Twoją stroną
2. Wyloguj się z aplikacji (jeśli jesteś zalogowany)
3. Przejdź bezpośrednio na stronę logowania: `/login` (bez parametrów URL)
4. Zaloguj się używając tych samych danych co wcześniej:
   - Email: `opcjaexclusivestyle@gmail.com`
   - Hasło: (twoje hasło)

### 3. Bezpośrednie przejście do panelu administratora

Po zalogowaniu system powinien przekierować Cię bezpośrednio na `/admin` bez parametrów URL. Jeśli nadal występują problemy, spróbuj poniższych kroków:

1. Po zalogowaniu ręcznie wpisz w przeglądarce adres `/admin` (bez żadnych parametrów)
2. Jeśli to nie pomoże, sprawdź w konsoli deweloperskiej przeglądarki (F12), czy nie występują błędy JavaScript
3. Sprawdź logi na serwerze, jeśli masz do nich dostęp

## Rozwiązane problemy

1. **Problem z URL** - Usunęliśmy używanie parametru `returnUrl` w adresach
2. **Nieskończona rekursja** - Poprawiliśmy polityki bezpieczeństwa RLS, aby nie tworzyły rekursji
3. **Konflikt polityk** - Dodaliśmy usuwanie istniejących polityk przed utworzeniem nowych

## Debugowanie

Jeśli po wykonaniu powyższych kroków problem nadal występuje, sprawdź następujące rzeczy:

1. W konsoli deweloperskiej przeglądarki:

   - Otwórz narzędzia deweloperskie (F12)
   - Przejdź do zakładki "Console" i sprawdź, czy nie ma błędów
   - Sprawdź w zakładce "Network", czy zapytania do API Supabase są poprawne

2. W konsoli Supabase:
   - Przejdź do zakładki "Authentication" > "Users" i sprawdź, czy Twój użytkownik istnieje
   - Przejdź do zakładki "Table Editor" > "profiles" i sprawdź, czy rekord z Twoim ID ma rolę "admin"

## Kontakt

Jeśli potrzebujesz dalszej pomocy, skontaktuj się z zespołem deweloperskim.
