import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    // Pobieranie danych z żądania
    const data = await req.json();
    const {
      name,
      email,
      phone,
      subject,
      message,
      formType,
      ...additionalData
    } = data;

    // Sprawdzenie wymaganych pól
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Brakuje wymaganych pól' },
        { status: 400 },
      );
    }

    // Konfiguracja transportera Nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT),
      secure: process.env.EMAIL_SERVER_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    // Adres, na który mają być wysyłane zgłoszenia
    const targetEmail = process.env.TARGET_EMAIL || 'twoj@email.pl';

    // Przygotowanie dodatkowych danych (jeśli istnieją) jako HTML
    let additionalDataHtml = '';
    if (Object.keys(additionalData).length > 0) {
      additionalDataHtml = '<h3>Dodatkowe informacje:</h3><ul>';
      Object.entries(additionalData).forEach(([key, value]) => {
        additionalDataHtml += `<li><strong>${key}:</strong> ${value}</li>`;
      });
      additionalDataHtml += '</ul>';
    }

    // Tworzenie treści emaila
    const emailSubject = formType
      ? `Nowe zgłoszenie: ${formType} - ${subject || 'Brak tematu'}`
      : `Nowe zgłoszenie: ${subject || 'Brak tematu'}`;

    const htmlContent = `
      <h2>Nowe zgłoszenie ze strony internetowej</h2>
      <p><strong>Formularz:</strong> ${formType || 'Kontakt'}</p>
      <p><strong>Od:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${phone ? `<p><strong>Telefon:</strong> ${phone}</p>` : ''}
      <h3>Wiadomość:</h3>
      <p>${message.replace(/\n/g, '<br>')}</p>
      ${additionalDataHtml}
      <hr>
      <p><em>Wiadomość wysłana automatycznie z formularza na stronie internetowej.</em></p>
    `;

    // Wysyłanie emaila
    const mailOptions = {
      from: `"Formularz strony" <${
        process.env.EMAIL_FROM || 'no-reply@twojadomena.pl'
      }>`,
      to: targetEmail,
      replyTo: email,
      subject: emailSubject,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Błąd podczas wysyłania emaila:', error);
    return NextResponse.json(
      { error: 'Wystąpił problem podczas wysyłania wiadomości' },
      { status: 500 },
    );
  }
}
