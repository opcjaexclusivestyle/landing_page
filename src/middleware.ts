import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Jeśli to nie jest ścieżka /admin, po prostu przechodzimy dalej
  if (!request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // Panel admin jest dostępny dla wszystkich - zabezpieczenia są na poziomie API
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
