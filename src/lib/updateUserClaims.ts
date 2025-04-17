import { supabase } from '@/lib/supabase';

/**
 * Funkcja aktualizująca metadane użytkownika i odświeżająca JWT token
 * Używana w przypadku, gdy użytkownik ma rolę admin w bazie danych,
 * ale nie w JWT claims.
 */
export async function updateUserClaims(userId: string, role: string = 'admin') {
  try {
    // 1. Najpierw aktualizujemy user metadata
    const { error: updateError } = await supabase.auth.updateUser({
      data: { role },
    });

    if (updateError) {
      console.error(
        '❌ Błąd podczas aktualizacji metadanych użytkownika:',
        updateError,
      );
      return { success: false, error: updateError };
    }

    // 2. Wymuszamy odświeżenie sesji, aby uzyskać nowy token JWT
    const { error: refreshError } = await supabase.auth.refreshSession();

    if (refreshError) {
      console.error('❌ Błąd podczas odświeżania sesji:', refreshError);
      return { success: false, error: refreshError };
    }

    // 3. Pobieramy nową sesję, aby potwierdzić, że claims zostały zaktualizowane
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      console.error('❌ Brak sesji po odświeżeniu');
      return { success: false, error: new Error('Brak sesji po odświeżeniu') };
    }

    console.log('✅ Claims użytkownika zaktualizowane pomyślnie');

    // Sprawdźmy, czy role zostały zaktualizowane w JWT
    const payloadBase64 = session.access_token.split('.')[1];
    const payload = JSON.parse(atob(payloadBase64));

    console.log('🔑 Nowe JWT Claims:', payload);
    console.log(
      '👮 Nowe metadane:',
      session.user.app_metadata,
      session.user.user_metadata,
    );

    return {
      success: true,
      session,
      userMetadata: session.user.user_metadata,
      appMetadata: session.user.app_metadata,
    };
  } catch (error) {
    console.error('❌ Nieoczekiwany błąd podczas aktualizacji claims:', error);
    return { success: false, error };
  }
}
