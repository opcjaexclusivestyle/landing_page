import { useState, useEffect } from 'react';
import { testConnection } from '@/lib/supabase';

const SupabaseConnectionTest = () => {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runTest = async () => {
    setLoading(true);
    setError(null);

    try {
      const testResult = await testConnection();
      setResult(testResult);
    } catch (err: any) {
      setError(err.message || 'Wystąpił nieznany błąd');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runTest();
  }, []);

  return (
    <div className='p-4 bg-gray-50 rounded-lg mb-6'>
      <h3 className='text-lg font-semibold mb-2'>Test połączenia z Supabase</h3>

      {loading && <p className='text-gray-600'>Testowanie połączenia...</p>}

      {error && (
        <div className='bg-red-50 p-3 rounded text-red-700 mb-3'>
          <p>Błąd: {error}</p>
        </div>
      )}

      {result && (
        <div className='bg-gray-100 p-3 rounded overflow-auto max-h-60'>
          <pre className='text-xs'>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}

      <button
        onClick={runTest}
        disabled={loading}
        className='mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50'
      >
        {loading ? 'Testowanie...' : 'Ponów test'}
      </button>
    </div>
  );
};

export default SupabaseConnectionTest;
