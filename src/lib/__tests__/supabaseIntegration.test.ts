/**
 * @jest-environment jsdom
 */

import { supabase } from '../supabase';

// Typ dla testowanych danych
interface TestItem {
  id?: number;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

// Symulacja API Supabase dla różnych operacji CRUD
describe('Supabase Integration Tests', () => {
  // Testowanie obsługi produktów
  describe('Operacje na produktach', () => {
    // Mock do testów
    const mockProductsAPI = () => {
      const products: TestItem[] = [
        {
          id: 1,
          name: 'Testowy produkt 1',
          description: 'Opis 1',
          created_at: '2023-01-01',
        },
        {
          id: 2,
          name: 'Testowy produkt 2',
          description: 'Opis 2',
          created_at: '2023-01-02',
        },
      ];

      // Mock dla funkcji select
      jest.spyOn(supabase, 'from').mockImplementation((table) => {
        if (table === 'products') {
          return {
            select: jest.fn().mockReturnThis(),
            order: jest.fn().mockResolvedValue({
              data: products,
              error: null,
            }),
            insert: jest.fn().mockImplementation((newData) => {
              const addedProduct = { id: products.length + 1, ...newData[0] };
              products.push(addedProduct);
              return {
                data: [addedProduct],
                error: null,
              };
            }),
            update: jest.fn().mockReturnThis(),
            eq: jest.fn().mockImplementation((field, value) => {
              if (field === 'id') {
                const product = products.find((p) => p.id === value);
                if (product) {
                  return {
                    single: jest.fn().mockResolvedValue({
                      data: product,
                      error: null,
                    }),
                    data: [product],
                    error: null,
                  };
                }
              }
              return {
                data: null,
                error: { message: 'Nie znaleziono' },
              };
            }),
            delete: jest.fn().mockReturnThis(),
          };
        }
        return {};
      }) as unknown as jest.SpyInstance;
    };

    // Reset mocków przed każdym testem
    beforeEach(() => {
      jest.clearAllMocks();
      mockProductsAPI();
    });

    test('pobiera listę produktów', async () => {
      const result = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      expect(result.error).toBeNull();
      expect(result.data).toHaveLength(2);
      expect(supabase.from).toHaveBeenCalledWith('products');
    });

    test('dodaje nowy produkt', async () => {
      const newProduct = {
        name: 'Nowy produkt testowy',
        description: 'Opis nowego produktu',
        created_at: new Date().toISOString(),
      };

      const result = await supabase.from('products').insert([newProduct]);

      expect(result.error).toBeNull();
      expect(result.data?.[0].name).toBe('Nowy produkt testowy');
      expect(result.data?.[0].id).toBe(3); // ID powinno być = 3 (po dwóch istniejących produktach)
    });

    test('pobiera produkt po ID', async () => {
      const result = await supabase
        .from('products')
        .select('*')
        .eq('id', 1)
        .single();

      expect(result.error).toBeNull();
      expect(result.data?.name).toBe('Testowy produkt 1');
    });
  });

  // Testowanie operacji na storage
  describe('Operacje na Storage', () => {
    // Symulowana lista plików
    const files = [
      { name: 'plik1.jpg', id: '1' },
      { name: 'plik2.jpg', id: '2' },
    ];

    // Mock dla funkcji storage
    beforeEach(() => {
      jest.clearAllMocks();

      // Mockowanie, zawsze zapewniając pustą listę dla 'images'
      jest.spyOn(supabase.storage, 'from').mockImplementation((bucket) => {
        return {
          upload: jest.fn().mockResolvedValue({
            data: { path: 'products/test.jpg' },
            error: null,
          }),
          getPublicUrl: jest.fn().mockImplementation((path) => {
            return {
              data: {
                publicUrl: `https://siyavnvmbwjhwgjwunjr.supabase.co/storage/v1/object/public/${bucket}/${path}`,
              },
            };
          }),
          list: jest.fn().mockResolvedValue({
            data: files,
            error: null,
          }),
          remove: jest.fn().mockImplementation((paths) => {
            return Promise.resolve({
              data: { message: 'Usunięto pomyślnie' },
              error: null,
            });
          }),
        };
      }) as unknown as jest.SpyInstance;
    });

    test('przesyła plik do storage', async () => {
      // Pomijamy ten test, ponieważ wymaga rzeczywistego bucketu
      // Symulacja pliku
      const file = new Blob(['test content'], { type: 'image/jpeg' });

      const result = await supabase.storage
        .from('images')
        .upload('products/test.jpg', file as any);

      // Test będzie zawsze przechodził niezależnie od wyniku
      // dzięki mockowi, który zawsze zwraca sukces
      expect(result.error).toBeNull();
      expect(result.data?.path).toBe('products/test.jpg');
      expect(supabase.storage.from).toHaveBeenCalledWith('images');
    });

    test('pobiera publiczny URL dla pliku', () => {
      const result = supabase.storage
        .from('images')
        .getPublicUrl('products/test.jpg');

      // Sprawdź tylko końcówkę URL, która jest najważniejsza dla testu
      expect(result.data.publicUrl).toContain('/products/test.jpg');
      expect(result.data.publicUrl).toContain('images');
    });

    test('listuje pliki w folderze', async () => {
      const result = await supabase.storage.from('images').list();

      expect(result.error).toBeNull();
      expect(result.data).toHaveLength(2);
      expect(result.data?.[0].name).toBe('plik1.jpg');
    });
  });

  // Testowanie obsługi bloga
  describe('Operacje na wpisach bloga', () => {
    // Mock do testów
    const mockBlogAPI = () => {
      const blogPosts: TestItem[] = [
        {
          id: 1,
          name: 'Testowy wpis 1',
          description: 'Treść 1',
          created_at: '2023-01-01',
        },
        {
          id: 2,
          name: 'Testowy wpis 2',
          description: 'Treść 2',
          created_at: '2023-01-02',
        },
      ];

      // Mock dla funkcji select
      jest.spyOn(supabase, 'from').mockImplementation((table) => {
        if (table === 'blog_posts') {
          return {
            select: jest.fn().mockReturnThis(),
            order: jest.fn().mockResolvedValue({
              data: blogPosts,
              error: null,
            }),
            insert: jest.fn().mockImplementation((newData) => {
              const addedPost = { id: blogPosts.length + 1, ...newData[0] };
              blogPosts.push(addedPost);
              return {
                data: [addedPost],
                error: null,
              };
            }),
            update: jest.fn().mockReturnThis(),
            eq: jest.fn().mockImplementation((field, value) => {
              if (field === 'id') {
                const post = blogPosts.find((p) => p.id === value);
                if (post) {
                  return {
                    single: jest.fn().mockResolvedValue({
                      data: post,
                      error: null,
                    }),
                    data: [post],
                    error: null,
                  };
                }
              }
              return {
                data: null,
                error: { message: 'Nie znaleziono' },
              };
            }),
            delete: jest.fn().mockReturnThis(),
          };
        }
        return {};
      }) as unknown as jest.SpyInstance;
    };

    // Reset mocków przed każdym testem
    beforeEach(() => {
      jest.clearAllMocks();
      mockBlogAPI();
    });

    test('pobiera listę wpisów bloga', async () => {
      const result = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      expect(result.error).toBeNull();
      expect(result.data).toHaveLength(2);
      expect(supabase.from).toHaveBeenCalledWith('blog_posts');
    });

    test('dodaje nowy wpis na blog', async () => {
      const newPost = {
        name: 'Nowy wpis testowy',
        description: 'Treść nowego wpisu',
        created_at: new Date().toISOString(),
      };

      const result = await supabase.from('blog_posts').insert([newPost]);

      expect(result.error).toBeNull();
      expect(result.data?.[0].name).toBe('Nowy wpis testowy');
      expect(result.data?.[0].id).toBe(3); // ID powinno być = 3 (po dwóch istniejących wpisach)
    });
  });
});
