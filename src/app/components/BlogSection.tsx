export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  publishDate: string;
  readTime: number;
  category: string;
  author: {
    name: string;
    avatar: string;
  };
}

// Tu możesz dodać inne eksporty związane z sekcją blogu
