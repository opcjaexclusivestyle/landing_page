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