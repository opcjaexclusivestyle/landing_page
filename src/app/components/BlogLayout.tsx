'use client';

import React, { ReactNode } from 'react';
import SimpleHeader from '../components/SimpleHeader';
interface BlogLayoutProps {
  children: ReactNode;
}

export default function BlogLayout({ children }: BlogLayoutProps) {
  return (
    <div className='blog-layout min-h-screen'>
      {/* Nagłówek bloga */}
      <SimpleHeader
        imageSrc='blog.png'
        title='Blog o Dekoracjach Okiennych i Tekstyliach'
        subtitle='Firany, zasłony, rolety i pościel'
        description='Odkryj inspiracje, porady i najnowsze trendy w dekoracji wnętrz.'
        height='60vh'
      />
      {/* Zawartość bloga */}
      <main>{children}</main>
    </div>
  );
}
