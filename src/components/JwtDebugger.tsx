'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { updateUserClaims } from '@/lib/updateUserClaims';

export default function JwtDebugger() {
  const [jwtInfo, setJwtInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [updateResult, setUpdateResult] = useState<any>(null);

  async function fetchJwtInfo() {
    try {
      setLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        console.error('Brak sesji');
        setJwtInfo({ error: 'Brak sesji' });
        return;
      }

      // Zdekoduj payload tokenu JWT
      const payloadBase64 = session.access_token.split('.')[1];
      const payload = JSON.parse(atob(payloadBase64));

      setJwtInfo({
        payload,
        appMetadata: session.user.app_metadata,
        userMetadata: session.user.user_metadata,
        role: payload.role,
        userId: session.user.id,
      });
    } catch (error) {
      console.error('Błąd podczas odczytywania JWT claims:', error);
      setJwtInfo({ error: 'Nie udało się odczytać JWT' });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchJwtInfo();
  }, []);

  const handleUpdateClaims = async () => {
    try {
      setUpdating(true);
      setUpdateResult(null);

      if (!jwtInfo?.userId) {
        setUpdateResult({ success: false, message: 'Brak ID użytkownika' });
        return;
      }

      const result = await updateUserClaims(jwtInfo.userId);
      setUpdateResult(result);

      // Odśwież informacje JWT
      await fetchJwtInfo();
    } catch (error) {
      console.error('Błąd podczas aktualizacji claims:', error);
      setUpdateResult({ success: false, error });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className='text-sm text-gray-500'>Ładowanie informacji JWT...</div>
    );
  }

  if (!jwtInfo) {
    return (
      <div className='text-sm text-red-500'>
        Nie udało się pobrać informacji JWT
      </div>
    );
  }

  return (
    <div className='bg-gray-50 border border-gray-200 rounded-md p-4 my-4'>
      <div className='flex justify-between items-center mb-2'>
        <h3 className='text-md font-semibold'>
          JWT Debugger (tylko do testów)
        </h3>
        <div className='flex gap-2'>
          <button
            onClick={handleUpdateClaims}
            disabled={updating}
            className='text-white text-xs bg-blue-500 px-2 py-1 rounded hover:bg-blue-600 disabled:opacity-50'
          >
            {updating ? 'Aktualizowanie...' : 'Aktualizuj Claims'}
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className='text-blue-500 text-sm hover:underline'
          >
            {expanded ? 'Zwiń' : 'Rozwiń'}
          </button>
        </div>
      </div>

      {updateResult && (
        <div
          className={`text-sm mb-2 p-2 rounded ${
            updateResult.success
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {updateResult.success
            ? 'Claims zaktualizowane pomyślnie!'
            : 'Błąd aktualizacji claims'}
        </div>
      )}

      {expanded && (
        <div className='text-sm'>
          <div className='mb-2'>
            <span className='font-semibold'>Role w JWT:</span>{' '}
            {jwtInfo.role || 'brak'}
          </div>

          <div className='mb-2'>
            <span className='font-semibold'>App Metadata:</span>
            <pre className='bg-gray-100 p-2 rounded-md overflow-auto max-h-24 text-xs'>
              {JSON.stringify(jwtInfo.appMetadata, null, 2) || 'brak'}
            </pre>
          </div>

          <div className='mb-2'>
            <span className='font-semibold'>User Metadata:</span>
            <pre className='bg-gray-100 p-2 rounded-md overflow-auto max-h-24 text-xs'>
              {JSON.stringify(jwtInfo.userMetadata, null, 2) || 'brak'}
            </pre>
          </div>

          <div>
            <span className='font-semibold'>Pełny payload JWT:</span>
            <pre className='bg-gray-100 p-2 rounded-md overflow-auto max-h-48 text-xs'>
              {JSON.stringify(jwtInfo.payload, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
