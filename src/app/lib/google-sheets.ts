import { GoogleSpreadsheet } from 'google-spreadsheet'
import { Product } from '../contexts/cart-context'
import { mapColorsToHex } from './colors'

export async function fetchProductsFromSheet(): Promise<Product[]> {
  try {
    // For demo purposes, we'll use a public sheet or you can configure with service account
    // Replace with your actual Google Sheet ID
    const SHEET_ID = process.env.GOOGLE_SHEET_ID || 'demo-sheet-id'
    const API_KEY = process.env.GOOGLE_SHEETS_API_KEY
    
    if (!API_KEY && !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
      // Return mock data if no API key is configured
      return getMockProducts()
    }

    const doc = new GoogleSpreadsheet(SHEET_ID, { apiKey: API_KEY })
    
    await doc.loadInfo()
    const sheet = doc.sheetsByIndex[0] // Use first sheet
    const rows = await sheet.getRows()
    
    const products: Product[] = rows.map((row, index) => {
      // Parse color names from sheet (expected format: "Color1,Color2,Color3")
      const colorsString = row.get('colors') || row.get('colores') || ''
      let colors = undefined
      
      if (colorsString) {
        try {
          const colorNames = colorsString.split(',').map((name: string) => name.trim()).filter(Boolean)
          colors = mapColorsToHex(colorNames)
        } catch (e) {
          console.warn(`Error parsing colors for product ${index + 1}:`, e)
        }
      }
      
      return {
        id: row.get('id') || `product-${index + 1}`,
        name: row.get('name') || row.get('nombre') || 'Producto sin nombre',
        price: parseFloat(row.get('price') || row.get('precio') || '0'),
        image: row.get('image') || row.get('imagen') || '/placeholder-product.jpg',
        description: row.get('description') || row.get('descripcion') || '',
        category: row.get('category') || row.get('categoria') || 'general',
        colors
      }
    })
    
    return products.filter(product => product.name !== 'Producto sin nombre')
  } catch (error) {
    console.error('Error fetching products from Google Sheet:', error)
    // Fallback to mock data
    return getMockProducts()
  }
}

function getMockProducts(): Product[] {
  return [
    {
      id: '1',
      name: 'Collar para Galgo',
      price: 2500,
      image: '/placeholder-collar.jpg',
      description: 'Collar especialmente diseñado para la anatomía única de los galgos. Cómodo y seguro.',
      category: 'accesorios',
      colors: mapColorsToHex(['Rojo', 'Azul', 'Negro', 'Marrón'])
    },
    {
      id: '2',
      name: 'Cama Ortopédica',
      price: 8900,
      image: '/placeholder-bed.jpg',
      description: 'Cama ortopédica extra suave para el descanso perfecto de tu galgo.',
      category: 'comodidad',
      colors: mapColorsToHex(['Gris', 'Beige', 'Azul marino'])
    },
    {
      id: '3',
      name: 'Abrigo de Invierno',
      price: 4200,
      image: '/placeholder-coat.jpg',
      description: 'Abrigo térmico para proteger a tu galgo del frío. Diseño elegante y funcional.',
      category: 'ropa',
      colors: mapColorsToHex(['Rojo', 'Verde', 'Negro', 'Rosa', 'Amarillo'])
    },
    {
      id: '4',
      name: 'Juguete Interactivo',
      price: 1800,
      image: '/placeholder-toy.jpg',
      description: 'Juguete diseñado para estimular la mente de tu galgo y mantenerlo entretenido.',
      category: 'juguetes',
      colors: mapColorsToHex(['Naranja', 'Verde', 'Morado'])
    },
    {
      id: '5',
      name: 'Correa Extensible',
      price: 3200,
      image: '/placeholder-leash.jpg',
      description: 'Correa extensible de alta calidad, perfecta para paseos largos y seguros.',
      category: 'accesorios',
      colors: mapColorsToHex(['Negro', 'Rojo', 'Azul'])
    },
    {
      id: '6',
      name: 'Suplemento Nutricional',
      price: 5500,
      image: '/placeholder-supplement.jpg',
      description: 'Suplemento nutricional específico para la salud articular y general de galgos.',
      category: 'salud'
      // No colors - product doesn't have color variants
    },
  ]
}