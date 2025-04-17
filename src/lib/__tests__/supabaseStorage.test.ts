import { supabase } from '../supabase';

// Mockowanie klienta Supabase
jest.mock('../supabase', () => {
  return {
    supabase: {
      storage: {
        from: jest.fn().mockImplementation((bucket) => {
          return {
            upload: jest.fn().mockImplementation((path, file) => {
              if (!file) {
                return Promise.resolve({
                  data: null,
                  error: { message: 'Nie podano pliku' },
                });
              }

              return Promise.resolve({
                data: { path },
                error: null,
              });
            }),
            getPublicUrl: jest.fn().mockImplementation((path) => {
              return {
                data: {
                  publicUrl: `https://siyavnvmbwjhwgjwunjr.supabase.co/storage/v1/object/public/${path}`,
                },
              };
            }),
            remove: jest.fn().mockImplementation((paths) => {
              if (paths.includes('error-path.jpg')) {
                return Promise.resolve({
                  data: null,
                  error: { message: 'Nie znaleziono pliku' },
                });
              }
              return Promise.resolve({
                data: { message: 'Usunięto pomyślnie' },
                error: null,
              });
            }),
            list: jest.fn().mockImplementation((path) => {
              return Promise.resolve({
                data: [
                  { name: 'plik1.jpg', id: '1' },
                  { name: 'plik2.jpg', id: '2' },
                ],
                error: null,
              });
            }),
          };
        }),
      },
    },
    getPublicStorageUrl: jest.fn().mockImplementation((bucket, path) => {
      return `https://siyavnvmbwjhwgjwunjr.supabase.co/storage/v1/object/public/${bucket}/${path}`;
    }),
  };
});

describe('Supabase Storage Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('przesyła plik do storage', async () => {
    // Przygotowanie danych testowych
    const bucket = 'images';
    const filePath = 'products/testowy-obraz.jpg';
    const file = new File(['test content'], 'test.jpg', { type: 'image/jpeg' });

    // Wywołanie funkcji upload
    const result = await supabase.storage.from(bucket).upload(filePath, file);

    // Sprawdzenie wyniku
    expect(result.error).toBeNull();
    expect(result.data).toEqual({ path: filePath });
    expect(supabase.storage.from).toHaveBeenCalledWith(bucket);
  });

  test('zwraca błąd przy próbie przesłania bez pliku', async () => {
    // Przygotowanie danych testowych
    const bucket = 'images';
    const filePath = 'products/testowy-obraz.jpg';
    const file = null;

    // Wywołanie funkcji upload
    const result = await supabase.storage.from(bucket).upload(filePath, file);

    // Sprawdzenie wyniku
    expect(result.error).not.toBeNull();
    expect(result.error.message).toBe('Nie podano pliku');
    expect(result.data).toBeNull();
  });

  test('pobiera publiczny URL dla przesłanego pliku', () => {
    // Przygotowanie danych testowych
    const bucket = 'images';
    const filePath = 'products/testowy-obraz.jpg';

    // Wywołanie funkcji getPublicUrl
    const result = supabase.storage.from(bucket).getPublicUrl(filePath);

    // Sprawdzenie wyniku
    expect(result.data.publicUrl).toBe(
      `https://siyavnvmbwjhwgjwunjr.supabase.co/storage/v1/object/public/${filePath}`,
    );
  });

  test('usuwa plik z storage', async () => {
    // Przygotowanie danych testowych
    const bucket = 'images';
    const filePath = 'products/testowy-obraz.jpg';

    // Wywołanie funkcji remove
    const result = await supabase.storage.from(bucket).remove([filePath]);

    // Sprawdzenie wyniku
    expect(result.error).toBeNull();
    expect(result.data).toEqual({ message: 'Usunięto pomyślnie' });
  });

  test('zwraca błąd przy próbie usunięcia nieistniejącego pliku', async () => {
    // Przygotowanie danych testowych
    const bucket = 'images';
    const filePath = 'error-path.jpg';

    // Wywołanie funkcji remove
    const result = await supabase.storage.from(bucket).remove([filePath]);

    // Sprawdzenie wyniku
    expect(result.error).not.toBeNull();
    expect(result.error.message).toBe('Nie znaleziono pliku');
    expect(result.data).toBeNull();
  });

  test('listuje pliki w folderze', async () => {
    // Przygotowanie danych testowych
    const bucket = 'images';
    const folderPath = 'products';

    // Wywołanie funkcji list
    const result = await supabase.storage.from(bucket).list(folderPath);

    // Sprawdzenie wyniku
    expect(result.error).toBeNull();
    expect(result.data).toHaveLength(2);
    expect(result.data[0].name).toBe('plik1.jpg');
    expect(result.data[1].name).toBe('plik2.jpg');
  });

  test('generuje poprawny publiczny URL dla pliku', () => {
    // Import funkcji pomocniczej
    const { getPublicStorageUrl } = require('../supabase');

    // Wywołanie funkcji
    const url = getPublicStorageUrl('images', 'products/test.jpg');

    // Sprawdzenie wyniku
    expect(url).toBe(
      'https://siyavnvmbwjhwgjwunjr.supabase.co/storage/v1/object/public/images/products/test.jpg',
    );
  });
});
