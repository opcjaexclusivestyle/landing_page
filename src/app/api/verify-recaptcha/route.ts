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

    const secretKey =
      process.env.RECAPTCHA_SECRET_KEY ||
      '6Lf30CUrAAAAAO45YzD3oPujooOulMdYMMJyWKrW';
    const projectId = process.env.RECAPTCHA_PROJECT_ID; // Opcjonalnie dla wersji Enterprise

    // Weryfikacja tokenu reCAPTCHA Enterprise
    const response = await fetch(
      `https://recaptchaenterprise.googleapis.com/v1/projects/${
        projectId || 'curtains-406215'
      }/assessments`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${secretKey}`,
        },
        body: JSON.stringify({
          event: {
            token,
            siteKey:
              process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ||
              '6Lf30CUrAAAAAMLoyk2w8_HgpqxbmYVZgZ_v4m96',
            expectedAction: 'SUBMIT_TESTIMONIAL',
          },
        }),
      },
    );

    if (!response.ok) {
      console.error('Błąd odpowiedzi reCAPTCHA:', await response.text());
      return NextResponse.json(
        {
          success: false,
          message: `Błąd weryfikacji reCAPTCHA: ${response.status} ${response.statusText}`,
        },
        { status: 500 },
      );
    }

    const data = await response.json();

    // Sprawdź wynik oceny reCAPTCHA Enterprise
    if (data.tokenProperties?.valid && data.riskAnalysis?.score >= 0.5) {
      return NextResponse.json({
        success: true,
        score: data.riskAnalysis?.score,
      });
    } else {
      console.error('Weryfikacja reCAPTCHA nieudana:', data);
      return NextResponse.json(
        {
          success: false,
          message: 'Weryfikacja reCAPTCHA nie powiodła się',
          details: data.tokenProperties?.invalidReason || 'Nieznany powód',
        },
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
