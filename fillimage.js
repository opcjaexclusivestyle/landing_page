const fs = require('fs');
const productData = require('./src/config/products.json'); // Zmieniona ścieżka

const baseURL =
  'https://siyavnvmbwjhwgjwunjr.supabase.co/storage/v1/object/public/calculator/';

const updatedProducts = productData.products.map((product) => {
  const folderName = product.name;
  // Dodajemy 4 pliki .webp do tablicy images
  product.images = [
    `${baseURL}${folderName}/1.webp`,
    `${baseURL}${folderName}/2.webp`,
    `${baseURL}${folderName}/3.webp`,
    `${baseURL}${folderName}/4.webp`,
  ];
  return product;
});

const finalData = { products: updatedProducts };

fs.writeFileSync(
  './src/config/product.json',
  JSON.stringify(finalData, null, 2),
); // Zmieniona ścieżka zapisu

console.log('✅ Zaktualizowano dane produktów');
