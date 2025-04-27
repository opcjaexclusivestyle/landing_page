'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import BeddingForm, {
  BeddingProductData,
  ColorOption,
  BeddingSet,
  SheetPrices,
} from '@/components/BeddingForm';
import Loading from '@/app/components/Loading';
import { LinenProduct } from '@/components/LinenProductsList';
import { notFound, useRouter, useSearchParams } from 'next/navigation';
import SimpleHeader from '@/app/components/SimpleHeader';

export default function ProductDetails({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<LinenProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const colorFromUrl = searchParams ? searchParams.get('color') : null;

  useEffect(() => {
    async function fetchProductDetails() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('products_linen')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) {
          console.error('Błąd podczas pobierania danych produktu:', error);
          setError(
            'Nie udało się załadować produktu. Spróbuj ponownie później.',
          );
          return;
        }

        if (!data) {
          notFound();
          return;
        }

        console.log('Pobrane dane produktu:', data);
        setProduct(data as LinenProduct);

        // Dodatkowe logowanie kolorów
        console.log('Kolory produktu:', data.colors);
        console.log('Domyślny kolor:', data.default_color);
        console.log('Kolor z URL:', colorFromUrl);
      } catch (error) {
        console.error('Błąd podczas pobierania danych produktu:', error);
        setError('Wystąpił nieoczekiwany błąd. Spróbuj ponownie później.');
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      fetchProductDetails();
    }
  }, [params.id, colorFromUrl]);

  // Przekształcenie danych produktu do formatu oczekiwanego przez BeddingForm
  const prepareBeddingProductData = (
    product: LinenProduct,
  ): BeddingProductData => {
    console.log('Przekształcanie danych produktu:', product);

    // Przekształcenie wariantów produktu na BeddingSet
    const beddingSets: BeddingSet[] = product.variants.map((variant) => {
      // Zakładamy, że nazwa zawiera wymiary pościeli i poduszki (np. "135x200 + 50x60")
      const dimensions = variant.additionalInfo.split(' i ');
      const beddingSize = variant.size; // lub można parsować z additionalInfo
      const pillowSize =
        dimensions.length > 1 ? dimensions[1].replace('poszewka ', '') : '';

      return {
        id: variant.id,
        label: variant.label,
        beddingSize,
        pillowSize,
        price: variant.price,
      };
    });

    // Przekształcenie opcji dodatkowych na SheetPrices
    const sheetPrices: SheetPrices = {};
    if (product.additional_options && product.additional_options.length > 0) {
      const sheetOption = product.additional_options.find(
        (opt) => opt.name === 'sheet',
      );
      if (sheetOption && sheetOption.sizes) {
        Object.keys(sheetOption.sizes).forEach((size) => {
          sheetPrices[size] = sheetOption.sizes[size];
        });
      }
    }

    // Przekształcenie kolorów produktu na format oczekiwany przez BeddingForm
    const colors: {
      [key in ColorOption]?: {
        images: string[];
        displayName: string;
        displayColor: string;
      };
    } = {};

    console.log('Oryginalne kolory produktu:', product.colors);

    Object.keys(product.colors).forEach((colorKey) => {
      const color = product.colors[colorKey];
      console.log('Przetwarzanie koloru:', colorKey, color);
      colors[colorKey as ColorOption] = {
        images: color.images,
        displayName: color.displayName,
        displayColor: color.displayColor,
      };
    });

    console.log('Przekształcone kolory:', colors);

    // Konwersja features z JSON string do tablicy, jeśli jest to potrzebne
    let features: string[] = [];
    if (typeof product.features === 'string') {
      try {
        features = JSON.parse(product.features);
      } catch (e) {
        console.error('Błąd parsowania features:', e);
        features = [product.features];
      }
    } else if (Array.isArray(product.features)) {
      features = product.features;
    }

    // Ustalenie domyślnego koloru - użyj koloru z URL jeśli istnieje w produkcie
    let defaultColor = product.default_color;
    if (colorFromUrl && Object.keys(colors).includes(colorFromUrl)) {
      defaultColor = colorFromUrl;
    }

    const result = {
      name: product.name,
      description: product.description,
      beddingSets,
      sheetPrices,
      colors: colors as any, // Type assertion, ponieważ TypeScript nie może zweryfikować, że wszystkie wymagane kolory są
      defaultColor: defaultColor as ColorOption,
      features,
    };

    console.log('Wynik przekształcenia:', result);
    return result;
  };

  if (loading) {
    return <Loading />;
  }

  if (error || !product) {
    return (
      <div className='max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8'>
        <div className='bg-red-50 border border-red-200 rounded-lg p-6 text-center'>
          <h2 className='text-xl font-bold text-red-700 mb-4'>
            Ups! Coś poszło nie tak
          </h2>
          <p className='text-red-600'>{error || 'Nie znaleziono produktu'}</p>
          <button
            onClick={() => router.push('/posciel-premium')}
            className='mt-4 px-4 py-2 bg-[var(--gold)] text-white rounded-md hover:bg-[var(--deep-gold)]'
          >
            Wróć do listy produktów
          </button>
        </div>
      </div>
    );
  }

  const beddingProductData = prepareBeddingProductData(product);

  // Logowanie danych przed przekazaniem do BeddingForm
  console.log('Dane przekazywane do BeddingForm:', beddingProductData);
  console.log('Kolory w BeddingForm:', beddingProductData.colors);
  console.log('Domyślny kolor w BeddingForm:', beddingProductData.defaultColor);

  return (
    <>
      <SimpleHeader
        videoSrc='/video/linen.mp4'
        title='Pościel i Prześcieradła'
        subtitle='Komfort i elegancja'
        description='Odkryj naszą kolekcję luksusowej pościeli'
        height='60vh'
      />
      <div className='max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8'>
        <BeddingForm productData={beddingProductData} />
      </div>
    </>
  );
}
