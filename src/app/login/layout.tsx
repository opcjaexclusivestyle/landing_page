import { ReactNode } from 'react';

export const metadata = {
  title: 'Logowanie - Panel Administratora',
  description: 'Logowanie do panelu administratora',
};

export default function LoginLayout({ children }: { children: ReactNode }) {
  return <div className='min-h-screen bg-gray-50'>{children}</div>;
}
