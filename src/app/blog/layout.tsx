import { ReactNode } from 'react';

export const metadata = {
  title: 'Blog - Inspiracje wnętrzarskie',
  description:
    'Odkryj najnowsze trendy wnętrzarskie, porady ekspertów i inspirujące historie',
};

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <div className='blog-root-layout'>
      {/* Możesz dodać tutaj nagłówek bloga, menu kategorii itp. */}
      <main>{children}</main>
      {/* Możesz dodać tutaj stopkę specyficzną dla bloga */}
    </div>
  );
}
