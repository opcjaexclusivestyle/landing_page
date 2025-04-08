# Komponenty nagłówka

## SimpleHeader

`SimpleHeader` to prosty, reuzywalny komponent nagłówka z filmem lub obrazem w tle oraz płynną animacją tekstu. W przeciwieństwie do innych komponentów nagłówkowych, nie zawiera przycisku CTA ani efektów maski i ładuje stronę bezpośrednio.

### Propsy

| Nazwa         | Typ                           | Domyślnie   | Opis                                                            |
| ------------- | ----------------------------- | ----------- | --------------------------------------------------------------- |
| `videoSrc`    | string                        | `undefined` | URL do pliku wideo w tle (mp4) - opcjonalne                     |
| `imageSrc`    | string                        | `undefined` | URL do obrazu tła - opcjonalne (jeśli nie podano wideo)         |
| `title`       | string                        | (wymagane)  | Główny tytuł nagłówka                                           |
| `subtitle`    | string                        | `''`        | Podtytuł (opcjonalny)                                           |
| `description` | string                        | `''`        | Krótki opis (opcjonalny)                                        |
| `height`      | string                        | `'70vh'`    | Wysokość komponentu                                             |
| `darkOverlay` | boolean                       | `true`      | Czy dodać ciemną nakładkę na tło dla lepszej widoczności tekstu |
| `textAlign`   | 'left' \| 'center' \| 'right' | `'center'`  | Wyrównanie tekstu                                               |
| `textColor`   | string                        | `'white'`   | Kolor tekstu                                                    |

### Przykład użycia

```tsx
import SimpleHeader from '@/components/SimpleHeader';

export default function ProductPage() {
  return (
    <>
      <SimpleHeader
        videoSrc='/videos/background.mp4'
        title='ZASŁONY'
        subtitle='Elegancja i styl'
        description='Odkryj kolekcję luksusowych zasłon'
        height='60vh'
        textAlign='center'
      />

      {/* Reszta zawartości strony */}
    </>
  );
}
```

### Zalety

- **Prostota** - Minimalistyczny, elegancki wygląd
- **Wydajność** - Lżejsza alternatywa bez złożonych efektów maskowania
- **Bezpośrednie ładowanie** - Nie wymaga interakcji użytkownika, cała strona ładuje się od razu
- **Elastyczność** - Możliwość użycia wideo lub obrazu jako tła
- **Responsywność** - Dostosowuje się do różnych rozmiarów ekranu

## Header

`Header` to uniwersalny, responsywny komponent nagłówka z animacją GSAP, który może być używany na różnych urządzeniach, w tym mobilnych. Komponent wykorzystuje efekt maski SVG na filmie oraz animowane elementy tekstowe.

### Propsy

| Nazwa               | Typ      | Domyślnie                          | Opis                                           |
| ------------------- | -------- | ---------------------------------- | ---------------------------------------------- |
| `videoSrc`          | string   | (wymagane)                         | URL do pliku wideo w tle (mp4)                 |
| `mainTitle`         | string   | (wymagane)                         | Główny tytuł, który pojawi się w masce SVG     |
| `subTitle`          | string   | `''`                               | Podtytuł (opcjonalny)                          |
| `description`       | string   | `''`                               | Krótki opis (opcjonalny)                       |
| `ctaText`           | string   | `'Zobacz więcej'`                  | Tekst przycisku CTA                            |
| `onCtaClick`        | function | `undefined`                        | Funkcja wywoływana po kliknięciu przycisku CTA |
| `height`            | string   | `'100vh'`                          | Wysokość komponentu                            |
| `textColor`         | string   | `'white'`                          | Kolor tekstu                                   |
| `textShadow`        | string   | `'2px 2px 8px rgba(0, 0, 0, 0.7)'` | Cień tekstu                                    |
| `initialScale`      | number   | `1`                                | Początkowa skala tekstu SVG                    |
| `finalScale`        | number   | `10`                               | Końcowa skala tekstu SVG (po animacji)         |
| `animationDuration` | number   | `3`                                | Czas trwania animacji w sekundach              |

### Przykład użycia

```tsx
import Header from '@/components/Header';

export default function HomePage() {
  const handleCtaClick = () => {
    console.log('Przycisk CTA został kliknięty');
    // Twoja logika po kliknięciu przycisku
  };

  return (
    <main>
      <Header
        videoSrc='/videos/background.mp4'
        mainTitle='FIRANY'
        subTitle='Elegancja i jakość'
        description='Odkryj najnowsze trendy'
        ctaText='Poznaj ofertę'
        onCtaClick={handleCtaClick}
      />

      {/* Reszta zawartości strony */}
    </main>
  );
}
```

### Responsywność

Komponent jest w pełni responsywny i dostosowuje się do różnych rozmiarów ekranu:

- Używa jednostek `clamp()` do skalowania tekstu
- Specjalne style dla urządzeń mobilnych (szerokość < 768px)
- Przycisk CTA na urządzeniach mobilnych jest umieszczony na środku na dole ekranu

### Uwagi

- Wideo powinno być zoptymalizowane pod kątem różnych urządzeń (zalecane formaty: mp4, WebM)
- Animacja bazuje na GSAP ScrollTrigger i jest wyzwalana podczas przewijania strony
- Komponent uwzględnia dostępność: dodano obsługę klawiatury dla przycisku CTA

## HeaderMask (starsza wersja)

To poprzednia wersja komponentu nagłówka, zachowana dla kompatybilności. Zalecamy używanie nowego komponentu `SimpleHeader` lub `Header` dla nowych projektów.
