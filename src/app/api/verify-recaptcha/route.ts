import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Brak tokenu reCAPTCHA' },
        { status: 400 },
      );
    }

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    const response = await fetch(
      'https://www.google.com/recaptcha/api/siteverify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `secret=${secretKey}&response=${token}`,
      },
    );

    const data = await response.json();

    if (data.success) {
      return NextResponse.json({ success: true });
    } else {
      console.error('Błąd weryfikacji reCAPTCHA:', data);
      return NextResponse.json(
        { success: false, message: 'Weryfikacja reCAPTCHA nie powiodła się' },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error('Błąd podczas weryfikacji reCAPTCHA:', error);
    return NextResponse.json(
      { success: false, message: 'Wystąpił błąd podczas weryfikacji' },
      { status: 500 },
    );
  }
}
