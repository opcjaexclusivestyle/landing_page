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
import { notFound, useRouter } from 'next/navigation';

export default function ProductDetails({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<LinenProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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
  }, [params.id]);

  // Przekształcenie danych produktu do formatu oczekiwanego przez BeddingForm
  const prepareBeddingProductData = (
    product: LinenProduct,
  ): BeddingProductData => {
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

    Object.keys(product.colors).forEach((colorKey) => {
      const color = product.colors[colorKey];
      if (
        colorKey === 'white' ||
        colorKey === 'beige' ||
        colorKey === 'silver' ||
        colorKey === 'black'
      ) {
        colors[colorKey as ColorOption] = {
          images: color.images,
          displayName: color.displayName,
          displayColor: color.displayColor,
        };
      }
    });

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

    return {
      name: product.name,
      description: product.description,
      beddingSets,
      sheetPrices,
      colors: colors as any, // Type assertion, ponieważ TypeScript nie może zweryfikować, że wszystkie wymagane kolory są
      defaultColor: product.default_color as ColorOption,
      features,
    };
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

  return (
    <div className='max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8'>
      <BeddingForm productData={beddingProductData} />
    </div>
  );
}
