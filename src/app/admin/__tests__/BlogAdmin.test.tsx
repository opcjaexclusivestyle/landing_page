import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import BlogManagementPage from '../blog/page';

// Mockowanie hooka next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
  }),
}));

// Mockowanie klienta Supabase
jest.mock('@/lib/supabase', () => {
  // Mockowane dane blogowe
  const mockData = [
    {
      id: 1,
      title: 'Testowy Wpis 1',
      content: '<p>Treść testowego wpisu 1</p>',
      excerpt: 'Krótki opis wpisu 1',
      image: 'https://przykład.com/obraz1.jpg',
      author_name: 'Jan Kowalski',
      author_avatar: 'https://przykład.com/avatar1.jpg',
      publish_date: '2023-01-01',
      is_published: true,
      slug: 'testowy-wpis-1',
    },
    {
      id: 2,
      title: 'Testowy Wpis 2',
      content: '<p>Treść testowego wpisu 2</p>',
      excerpt: 'Krótki opis wpisu 2',
      image: 'https://przykład.com/obraz2.jpg',
      author_name: 'Anna Nowak',
      author_avatar: 'https://przykład.com/avatar2.jpg',
      publish_date: '2023-01-02',
      is_published: false,
      slug: 'testowy-wpis-2',
    },
  ];

  let blogPosts = [...mockData];

  return {
    supabase: {
      from: jest.fn().mockImplementation((table) => {
        if (table === 'blog_posts') {
          return {
            select: jest.fn().mockReturnValue({
              order: jest.fn().mockReturnValue({
                data: blogPosts,
                error: null,
              }),
            }),
            insert: jest.fn().mockImplementation((newPosts) => {
              const insertedPosts = newPosts.map((post: any, index: number) => {
                const newPost = {
                  ...post,
                  id: blogPosts.length + index + 1,
                };
                blogPosts.push(newPost);
                return newPost;
              });
              return {
                data: insertedPosts,
                error: null,
              };
            }),
            update: jest.fn().mockImplementation((updates) => {
              return {
                eq: jest.fn().mockImplementation((field, value) => {
                  if (field === 'id') {
                    const index = blogPosts.findIndex((p) => p.id === value);
                    if (index !== -1) {
                      blogPosts[index] = { ...blogPosts[index], ...updates };
                      return { data: blogPosts[index], error: null };
                    }
                  }
                  return {
                    data: null,
                    error: { message: 'Nie znaleziono wpisu' },
                  };
                }),
              };
            }),
            delete: jest.fn().mockReturnThis(),
            eq: jest.fn().mockImplementation((field, value) => {
              if (field === 'id') {
                const index = blogPosts.findIndex((p) => p.id === value);
                if (index !== -1) {
                  const deletedPost = blogPosts.splice(index, 1)[0];
                  return { data: deletedPost, error: null };
                }
              }
              return {
                data: null,
                error: { message: 'Nie znaleziono wpisu' },
              };
            }),
          };
        }
        return {};
      }),
      storage: {
        from: jest.fn().mockReturnValue({
          upload: jest.fn().mockReturnValue({
            data: { path: 'blog/testowy-obraz.jpg' },
            error: null,
          }),
          getPublicUrl: jest.fn().mockReturnValue({
            data: { publicUrl: 'https://przykład.com/nowy-obraz.jpg' },
          }),
        }),
      },
    },
  };
});

// Mockowane dane dla testów
const mockBlogPosts = [
  {
    id: 1,
    title: 'Testowy Wpis 1',
    content: '<p>Treść testowego wpisu 1</p>',
    excerpt: 'Krótki opis wpisu 1',
    image: 'https://przykład.com/obraz1.jpg',
    author_name: 'Jan Kowalski',
    author_avatar: 'https://przykład.com/avatar1.jpg',
    publish_date: '2023-01-01',
    is_published: true,
    slug: 'testowy-wpis-1',
  },
  {
    id: 2,
    title: 'Testowy Wpis 2',
    content: '<p>Treść testowego wpisu 2</p>',
    excerpt: 'Krótki opis wpisu 2',
    image: 'https://przykład.com/obraz2.jpg',
    author_name: 'Anna Nowak',
    author_avatar: 'https://przykład.com/avatar2.jpg',
    publish_date: '2023-01-02',
    is_published: false,
    slug: 'testowy-wpis-2',
  },
];

// Mockowanie komponentu Image z Next.js
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    return <img {...props} />;
  },
}));

// Helper do symulacji plików
const createMockFile = (name: string, type: string) => {
  const file = new File(['test'], name, { type });
  Object.defineProperty(file, 'text', {
    value: () => Promise.resolve('test content'),
  });
  return file;
};

describe('BlogManagementPage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renderuje listę wpisów bloga', async () => {
    render(<BlogManagementPage />);

    // Sprawdzamy, czy tytuł strony jest wyświetlany
    expect(screen.getByText('Zarządzanie blogiem')).toBeInTheDocument();

    // Sprawdzamy, czy przycisk "Dodaj nowy wpis" jest wyświetlany
    expect(screen.getByText('Dodaj nowy wpis')).toBeInTheDocument();

    // Czekamy na załadowanie danych i sprawdzamy, czy wpisy są wyświetlane
    await waitFor(() => {
      expect(screen.getByText('Testowy Wpis 1')).toBeInTheDocument();
      expect(screen.getByText('Testowy Wpis 2')).toBeInTheDocument();
      expect(screen.getByText('Jan Kowalski')).toBeInTheDocument();
      expect(screen.getByText('Anna Nowak')).toBeInTheDocument();
    });
  });

  test('otwiera formularz dodawania nowego wpisu', async () => {
    render(<BlogManagementPage />);

    // Klikamy przycisk "Dodaj nowy wpis"
    fireEvent.click(screen.getByText('Dodaj nowy wpis'));

    // Sprawdzamy, czy formularz dodawania jest wyświetlany
    expect(screen.getByText('Dodaj nowy wpis na blog')).toBeInTheDocument();

    // Sprawdzamy obecność pól formularza
    expect(screen.getByLabelText(/Tytuł wpisu/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Imię autora/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Data publikacji/i)).toBeInTheDocument();
  });

  test('dodaje nowy wpis bloga', async () => {
    const { supabase } = require('@/lib/supabase');
    const insertMock = jest.fn().mockReturnValue({
      data: [{ id: 3, title: 'Nowy Wpis Bloga' }],
      error: null,
    });

    // @ts-ignore - nadpisujemy mockowaną funkcję
    supabase.from().insert = insertMock;

    render(<BlogManagementPage />);

    // Klikamy przycisk "Dodaj nowy wpis"
    fireEvent.click(screen.getByText('Dodaj nowy wpis'));

    // Wypełniamy formularz
    fireEvent.change(screen.getByLabelText(/Tytuł wpisu/i), {
      target: { value: 'Nowy Wpis Bloga' },
    });
    fireEvent.change(screen.getByLabelText(/Imię autora/i), {
      target: { value: 'Autor Testowy' },
    });
    fireEvent.change(screen.getByLabelText(/Data publikacji/i), {
      target: { value: '2023-02-01' },
    });

    // Symulujemy przesłanie formularza
    fireEvent.click(screen.getByText('Zapisz wpis'));

    // Sprawdzamy, czy funkcja dodawania została wywołana
    await waitFor(() => {
      expect(insertMock).toHaveBeenCalled();
    });
  });

  test('edytuje istniejący wpis bloga', async () => {
    render(<BlogManagementPage />);

    // Czekamy na załadowanie danych
    await waitFor(() => {
      expect(screen.getByText('Testowy Wpis 1')).toBeInTheDocument();
    });

    // Klikamy przycisk "Edytuj" dla pierwszego wpisu
    const editButtons = screen.getAllByText('Edytuj');
    fireEvent.click(editButtons[0]);

    // Sprawdzamy, czy formularz edycji jest wypełniony danymi istniejącego wpisu
    expect(screen.getByDisplayValue('Testowy Wpis 1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Jan Kowalski')).toBeInTheDocument();

    // Modyfikujemy tytuł wpisu
    fireEvent.change(screen.getByDisplayValue('Testowy Wpis 1'), {
      target: { value: 'Zaktualizowany Wpis' },
    });

    // Symulujemy przesłanie formularza
    fireEvent.click(screen.getByText('Zapisz wpis'));

    // Po zapisaniu formularza powinno być wyświetlone zaktualizowane dane
    await waitFor(() => {
      expect(screen.getByText('Zaktualizowany Wpis')).toBeInTheDocument();
    });
  });

  test('usuwa wpis bloga po potwierdzeniu', async () => {
    // Mockujemy window.confirm
    const confirmSpy = jest.spyOn(window, 'confirm');
    confirmSpy.mockImplementation(() => true);

    render(<BlogManagementPage />);

    // Czekamy na załadowanie danych
    await waitFor(() => {
      expect(screen.getByText('Testowy Wpis 1')).toBeInTheDocument();
    });

    // Klikamy przycisk "Usuń" dla pierwszego wpisu
    const deleteButtons = screen.getAllByText('Usuń');
    fireEvent.click(deleteButtons[0]);

    // Sprawdzamy, czy potwierdzenie zostało wywołane
    expect(confirmSpy).toHaveBeenCalledWith(
      'Czy na pewno chcesz usunąć ten wpis?',
    );

    // Po usunięciu wpisu powinien zniknąć z listy
    await waitFor(() => {
      expect(screen.queryByText('Testowy Wpis 1')).not.toBeInTheDocument();
    });
  });

  test('obsługuje przesyłanie obrazów', async () => {
    const { supabase } = require('@/lib/supabase');
    const uploadMock = jest.fn().mockReturnValue({
      data: { path: 'blog/testowy-obraz.jpg' },
      error: null,
    });
    const getPublicUrlMock = jest.fn().mockReturnValue({
      data: { publicUrl: 'https://przykład.com/nowy-obraz.jpg' },
    });

    // @ts-ignore - nadpisujemy mockowane funkcje
    supabase.storage.from().upload = uploadMock;
    // @ts-ignore
    supabase.storage.from().getPublicUrl = getPublicUrlMock;

    render(<BlogManagementPage />);

    // Klikamy przycisk "Dodaj nowy wpis"
    fireEvent.click(screen.getByText('Dodaj nowy wpis'));

    // Szukamy inputu plików i symulujemy przesłanie pliku
    const fileInputs = document.querySelectorAll('input[type="file"]');
    const fileInput = fileInputs[0]; // Pierwszy input typu file (dla głównego obrazu)

    // Symulujemy zmianę pliku
    const file = createMockFile('test.jpg', 'image/jpeg');
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Wypełniamy wymagane pola formularza
    fireEvent.change(screen.getByLabelText(/Tytuł wpisu/i), {
      target: { value: 'Wpis z obrazem' },
    });
    fireEvent.change(screen.getByLabelText(/Imię autora/i), {
      target: { value: 'Autor Testowy' },
    });
    fireEvent.change(screen.getByLabelText(/Data publikacji/i), {
      target: { value: '2023-02-01' },
    });

    // Zapisujemy wpis
    fireEvent.click(screen.getByText('Zapisz wpis'));

    // Sprawdzamy, czy funkcja przesyłania została wywołana
    await waitFor(() => {
      expect(uploadMock).toHaveBeenCalled();
    });
  });
});
