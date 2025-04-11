import { BlogPost } from '../components/BlogSection';

// Funkcja generująca obrazy-placeholdery
function getPlaceholderImage(
  width: number,
  height: number,
  text: string = 'Blog',
): string {
  return `https://placehold.co/${width}x${height}/E0E0E0/808080?text=${text.replace(
    /\s+/g,
    '+',
  )}`;
}

// Funkcja generująca placeholdery awatarów
function getAvatarPlaceholder(name: string): string {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  return `https://placehold.co/100x100/4F46E5/FFFFFF?text=${initials}`;
}

// Przykładowe dane do bloga
const blogPosts: BlogPost[] = [
  {
    id: 1,
    title:
      'Minimalistyczny salon - jak urządzić przestrzeń w stylu skandynawskim',
    excerpt:
      'Minimalizm i styl skandynawski to trendy, które od lat cieszą się niesłabnącą popularnością. Poznaj kluczowe zasady projektowania wnętrz w tym stylu.',
    category: 'Inspiracje',
    image: getPlaceholderImage(800, 600, 'Minimalistyczny salon'),
    publishDate: '12 listopada 2023',
    author: {
      name: 'Magda Nowak',
      avatar: getAvatarPlaceholder('Magda Nowak'),
    },
    readTime: 6,
  },
  {
    id: 2,
    title: 'Jak dobrać oświetlenie do różnych pomieszczeń',
    excerpt:
      'Odpowiednie oświetlenie jest jednym z kluczowych elementów aranżacji wnętrz. Sprawdź, jak zaplanować oświetlenie w każdym pomieszczeniu.',
    category: 'Porady',
    image: getPlaceholderImage(800, 600, 'Oświetlenie wnętrz'),
    publishDate: '5 listopada 2023',
    author: {
      name: 'Jan Kowalski',
      avatar: getAvatarPlaceholder('Jan Kowalski'),
    },
    readTime: 8,
  },
  {
    id: 3,
    title: 'Trendy kolorystyczne 2024 - co będzie modne w nadchodzącym roku',
    excerpt:
      'Poznaj najnowsze prognozy dotyczące kolorów, które będą dominować we wnętrzach w 2024 roku. Sprawdź, jak wprowadzić je do swojego domu.',
    category: 'Trendy',
    image: getPlaceholderImage(800, 600, 'Trendy kolorystyczne'),
    publishDate: '29 października 2023',
    author: {
      name: 'Anna Wiśniewska',
      avatar: getAvatarPlaceholder('Anna Wiśniewska'),
    },
    readTime: 5,
  },
  {
    id: 4,
    title: 'Jak stworzyć przytulną sypialnię w stylu boho',
    excerpt:
      'Styl boho to kwintesencja przytulności i swobody. Dowiedz się, jak wprowadzić ten styl do swojej sypialni i cieszyć się wyjątkowym klimatem.',
    category: 'Inspiracje',
    image: getPlaceholderImage(800, 600, 'Sypialnia boho'),
    publishDate: '22 października 2023',
    author: {
      name: 'Magda Nowak',
      avatar: getAvatarPlaceholder('Magda Nowak'),
    },
    readTime: 7,
  },
  {
    id: 5,
    title: 'Mały metraż - sprytne rozwiązania do małych mieszkań',
    excerpt:
      'Nawet na małej przestrzeni można stworzyć funkcjonalne i estetyczne wnętrze. Sprawdź nasze porady dotyczące aranżacji małych pomieszczeń.',
    category: 'Porady',
    image: getPlaceholderImage(800, 600, 'Małe mieszkanie'),
    publishDate: '15 października 2023',
    author: {
      name: 'Jan Kowalski',
      avatar: getAvatarPlaceholder('Jan Kowalski'),
    },
    readTime: 9,
  },
  {
    id: 6,
    title: 'Kuchnia w stylu industrialnym - surowe piękno i funkcjonalność',
    excerpt:
      'Styl industrialny w kuchni to połączenie surowości, funkcjonalności i niepowtarzalnego charakteru. Poznaj kluczowe elementy tego stylu.',
    category: 'Inspiracje',
    image: getPlaceholderImage(800, 600, 'Kuchnia industrialna'),
    publishDate: '8 października 2023',
    author: {
      name: 'Anna Wiśniewska',
      avatar: getAvatarPlaceholder('Anna Wiśniewska'),
    },
    readTime: 6,
  },
];

// Funkcja do pobierania wszystkich postów
export async function getAllPosts(): Promise<BlogPost[]> {
  // Tutaj w przyszłości możesz dodać kod do pobierania danych z API
  return blogPosts;
}

// Funkcja do pobierania posta po ID
export async function getPostById(id: number): Promise<BlogPost | undefined> {
  return blogPosts.find((post) => post.id === id);
}

// Funkcja do pobierania postów po kategorii
export async function getPostsByCategory(
  category: string,
): Promise<BlogPost[]> {
  return blogPosts.filter(
    (post) => post.category.toLowerCase() === category.toLowerCase(),
  );
}

// Funkcja do pobierania powiązanych postów (postów z tej samej kategorii)
export async function getRelatedPosts(
  postId: number,
  category: string,
  limit: number = 3,
): Promise<BlogPost[]> {
  return blogPosts
    .filter((post) => post.id !== postId && post.category === category)
    .slice(0, limit);
}
