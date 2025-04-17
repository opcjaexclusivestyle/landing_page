'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
  created_at: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editRole, setEditRole] = useState<'user' | 'admin'>('user');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    setError(null);

    try {
      // Pobieramy dane użytkowników z tabeli auth.users i profiles
      const { data: authUsers, error: authError } =
        await supabase.auth.admin.listUsers();

      if (authError) throw authError;

      if (!authUsers) {
        setUsers([]);
        return;
      }

      // Pobieramy profile użytkowników z tabeli profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesError) throw profilesError;

      // Łączymy dane z obu tabel
      const mergedUsers = authUsers.users.map((user) => {
        const profile = profiles?.find((p) => p.id === user.id);
        return {
          id: user.id,
          email: user.email || '',
          role: profile?.role || 'user',
          created_at: user.created_at,
        };
      });

      setUsers(mergedUsers);
    } catch (err: any) {
      console.error('Błąd podczas pobierania użytkowników:', err);
      setError(err.message || 'Wystąpił błąd podczas pobierania użytkowników');
    } finally {
      setLoading(false);
    }
  }

  const handleEditClick = (user: User) => {
    setEditingUserId(user.id);
    setEditRole(user.role);
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
  };

  const handleSaveEdit = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: editRole })
        .eq('id', userId);

      if (error) throw error;

      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, role: editRole } : user,
        ),
      );

      setSuccessMessage('Rola użytkownika została zaktualizowana');
      setTimeout(() => setSuccessMessage(null), 3000);

      setEditingUserId(null);
    } catch (err: any) {
      setError(err.message || 'Wystąpił błąd podczas zapisywania zmian');
    }
  };

  return (
    <div className='container mx-auto py-6'>
      <h1 className='text-3xl font-bold mb-6'>Zarządzanie użytkownikami</h1>

      {error && (
        <div className='bg-red-50 border-l-4 border-red-500 p-4 mb-6'>
          <div className='flex'>
            <div className='flex-shrink-0'>
              <svg
                className='h-5 w-5 text-red-500'
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
              <p className='text-red-700'>{error}</p>
            </div>
          </div>
        </div>
      )}

      {successMessage && (
        <div className='bg-green-50 border-l-4 border-green-500 p-4 mb-6'>
          <div className='flex'>
            <div className='flex-shrink-0'>
              <svg
                className='h-5 w-5 text-green-500'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
            <div className='ml-3'>
              <p className='text-green-700'>{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      <div className='bg-white shadow-md rounded-lg overflow-hidden'>
        <div className='flex justify-between items-center p-4 border-b'>
          <h2 className='text-xl font-semibold'>Lista użytkowników</h2>
          <button
            onClick={fetchUsers}
            className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md'
          >
            Odśwież
          </button>
        </div>

        {loading ? (
          <div className='p-8 text-center'>
            <div className='w-12 h-12 border-4 border-t-[var(--gold)] border-gray-200 rounded-full animate-spin mx-auto'></div>
            <p className='mt-4 text-gray-600'>Ładowanie użytkowników...</p>
          </div>
        ) : users.length === 0 ? (
          <p className='text-center py-8 text-gray-500'>
            Brak użytkowników do wyświetlenia
          </p>
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    Email
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    Rola
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    Data utworzenia
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    Akcje
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-900'>{user.email}</div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      {editingUserId === user.id ? (
                        <select
                          value={editRole}
                          onChange={(e) =>
                            setEditRole(e.target.value as 'user' | 'admin')
                          }
                          className='border rounded px-2 py-1 text-sm'
                        >
                          <option value='user'>user</option>
                          <option value='admin'>admin</option>
                        </select>
                      ) : (
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${
                            user.role === 'admin'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {user.role}
                        </span>
                      )}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {new Date(user.created_at).toLocaleDateString('pl-PL')}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                      {editingUserId === user.id ? (
                        <div className='flex space-x-2 justify-end'>
                          <button
                            onClick={() => handleSaveEdit(user.id)}
                            className='text-indigo-600 hover:text-indigo-900'
                          >
                            Zapisz
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className='text-red-600 hover:text-red-900'
                          >
                            Anuluj
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEditClick(user)}
                          className='text-indigo-600 hover:text-indigo-900'
                        >
                          Edytuj
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
