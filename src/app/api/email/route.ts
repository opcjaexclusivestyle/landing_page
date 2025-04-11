import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Tymczasowo tylko rejestrujemy dane zamiast wysyłać email
    console.log('Email request received:', body);

    // Możemy dodać prawdziwą funkcjonalność wysyłania e-maili później
    // gdy rozwiążemy problem z nodemailer

    return NextResponse.json(
      { message: 'Wiadomość została odebrana. Skontaktujemy się wkrótce.' },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error in email API:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas przetwarzania Twojej wiadomości.' },
      { status: 500 },
    );
  }
}
