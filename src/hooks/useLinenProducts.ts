import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

// Interfejs dla kolorów produktu
export interface LinenProductColor {
  code: string;
  images: string[];
  displayName: string;
  displayColor: string;
}

// Interfejs dla wariantów produktu
export interface LinenProductVariant {
  id: number;
  size: string;
  label: string;
  price: number;
  additionalInfo: string;
}

// Interfejs dla produktów z tabeli products_linen
export interface LinenProduct {
  id: string;
  name: string;
  description: string;
  base_product: string;
  default_color: string;
  colors: { [key: string]: LinenProductColor };
  variants: LinenProductVariant[];
}

// Opcje konfiguracyjne dla hooka
export interface UseLinenProductsOptions {
  limit?: number;
  uniqueColors?: boolean;
  colorNames?: string[];
}

// Hook do pobierania produktów pościeli
export function useLinenProducts(options: UseLinenProductsOptions = {}) {
  const [products, setProducts] = useState<LinenProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Funkcja pomocnicza do określenia koloru produktu
  const getProductColor = (product: LinenProduct): string => {
    return (
      product.default_color ||
      (product.colors ? Object.keys(product.colors)[0] : '')
    );
  };

  // Funkcja pomocnicza do pobierania głównego obrazu produktu
  const getMainImage = (product: LinenProduct): string => {
    // Pobierz domyślny kolor lub pierwszy dostępny
    const defaultColor = product.default_color;

    if (
      product.colors &&
      product.colors[defaultColor] &&
      product.colors[defaultColor].images &&
      product.colors[defaultColor].images.length > 0
    ) {
      return product.colors[defaultColor].images[0];
    }

    // Jeśli nie ma domyślnego koloru, pobierz pierwszy obraz z pierwszego dostępnego koloru
    const firstColorKey = product.colors
      ? Object.keys(product.colors)[0]
      : null;
    if (
      firstColorKey &&
      product.colors[firstColorKey].images &&
      product.colors[firstColorKey].images.length > 0
    ) {
      return product.colors[firstColorKey].images[0];
    }

    // Jeśli nie znaleziono żadnego obrazu, zwróć placeholder
    return '/placeholder.jpg';
  };

  // Funkcja do pobierania ceny produktu
  const getProductPrice = (product: LinenProduct): number => {
    if (
      product.variants &&
      product.variants.length > 0 &&
      product.variants[0].price
    ) {
      return product.variants[0].price;
    }
    return 0;
  };

  // Funkcja do pobierania koloru produktu
  const getProductColorInfo = (
    product: LinenProduct,
  ): { name: string; color: string; code: string } => {
    const defaultColor = product.default_color;

    if (product.colors && product.colors[defaultColor]) {
      return {
        name: product.colors[defaultColor].displayName,
        color: product.colors[defaultColor].displayColor,
        code: product.colors[defaultColor].code,
      };
    }

    const firstColorKey = product.colors
      ? Object.keys(product.colors)[0]
      : null;
    if (firstColorKey && product.colors[firstColorKey]) {
      return {
        name: product.colors[firstColorKey].displayName,
        color: product.colors[firstColorKey].displayColor,
        code: product.colors[firstColorKey].code,
      };
    }

    return { name: 'Nieznany', color: '#CCCCCC', code: 'unknown' };
  };

  // Funkcja do pobierania wszystkich dostępnych kolorów produktu
  const getAllProductColors = (
    product: LinenProduct,
  ): { [key: string]: { name: string; color: string; code: string } } => {
    const colors: {
      [key: string]: { name: string; color: string; code: string };
    } = {};

    if (product.colors) {
      Object.keys(product.colors).forEach((colorKey) => {
        const colorData = product.colors[colorKey];
        colors[colorKey] = {
          name: colorData.displayName,
          color: colorData.displayColor,
          code: colorData.code,
        };
      });
    }

    return colors;
  };

  useEffect(() => {
    async function fetchLinenProducts() {
      setLoading(true);
      try {
        // Pobieramy wszystkie produkty z bazy
        const { data, error } = await supabase
          .from('products_linen')
          .select('*');

        if (error) throw error;

        if (!data || data.length === 0) {
          setError('Brak produktów do wyświetlenia');
          setLoading(false);
          return;
        }

        let selectedProducts: LinenProduct[] = [...data];

        // Jeśli chcemy produkty z unikalnymi kolorami
        if (options.uniqueColors) {
          const uniqueProducts: LinenProduct[] = [];
          const usedColors = new Set<string>();

          // Najpierw wybieramy produkty z określonymi kolorami, jeśli podano
          if (options.colorNames && options.colorNames.length > 0) {
            const colorCodes = options.colorNames.map((name) =>
              name.toLowerCase(),
            );

            for (const product of data) {
              if (uniqueProducts.length >= (options.limit || 4)) break;

              const productColor = getProductColor(product);
              if (
                colorCodes.includes(productColor) &&
                !usedColors.has(productColor)
              ) {
                uniqueProducts.push(product);
                usedColors.add(productColor);
              }
            }
          }

          // Następnie dodajemy pozostałe produkty z unikalnymi kolorami
          for (const product of data) {
            if (uniqueProducts.length >= (options.limit || 4)) break;

            const productColor = getProductColor(product);
            if (!usedColors.has(productColor)) {
              uniqueProducts.push(product);
              usedColors.add(productColor);
            }
          }

          // Jeśli nadal nie mamy wystarczającej liczby produktów, dodajemy pozostałe
          if (uniqueProducts.length < (options.limit || 4)) {
            for (const product of data) {
              if (
                uniqueProducts.length >= (options.limit || 4) ||
                uniqueProducts.includes(product)
              ) {
                continue;
              }
              uniqueProducts.push(product);
            }
          }

          selectedProducts = uniqueProducts;
        }

        // Ograniczenie liczby produktów, jeśli podano limit
        if (options.limit && selectedProducts.length > options.limit) {
          selectedProducts = selectedProducts.slice(0, options.limit);
        }

        console.log('Wybrane produkty z pościeli:', selectedProducts);
        setProducts(selectedProducts);
      } catch (error) {
        console.error('Błąd podczas pobierania produktów pościeli:', error);
        setError(
          'Wystąpił błąd podczas ładowania produktów. Spróbuj ponownie później.',
        );
      } finally {
        setLoading(false);
      }
    }

    fetchLinenProducts();
  }, [options.limit, options.uniqueColors, options.colorNames]);

  return {
    products,
    loading,
    error,
    getMainImage,
    getProductPrice,
    getProductColorInfo,
    getAllProductColors,
  };
}
