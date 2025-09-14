import { NextResponse } from 'next/server'
import Papa from 'papaparse'
import { Product } from '../../contexts/cart-context'
import { mapColorsToHex } from '../../lib/colors'

interface CSVRow {
  id?: string
  name?: string
  nombre?: string
  price?: string
  precio?: string
  image?: string
  imagen?: string
  description?: string
  descripcion?: string
  category?: string
  categoria?: string
  colors?: string
  colores?: string
}

// Mock products as fallback
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

export async function GET() {
  try {
    const csvUrl = process.env.GOOGLE_SHEETS_CSV_URL
    
    if (!csvUrl) {
      console.log('No CSV URL configured, using mock data')
      return NextResponse.json({ products: getMockProducts() })
    }

    // Fetch CSV data
    const response = await fetch(csvUrl, {
      cache: 'no-store' // Always fetch fresh data
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.statusText}`)
    }
    
    const csvData = await response.text()
    
    // Parse CSV with Papa Parse
    const parseResult = Papa.parse<CSVRow>(csvData, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header: string) => header.toLowerCase().trim()
    })
    
    if (parseResult.errors.length > 0) {
      console.warn('CSV parsing errors:', parseResult.errors)
    }
    
    // Transform CSV rows to Product objects
    const products: Product[] = parseResult.data
      .map((row, index) => {
        // Parse color names from CSV (expected format: "Color1,Color2,Color3")
        const colorsString = row.colors || row.colores || ''
        let colors = undefined
        
        if (colorsString) {
          try {
            const colorNames = colorsString.split(',')
              .map((name: string) => name.trim())
              .filter(Boolean)
            colors = mapColorsToHex(colorNames)
          } catch (e) {
            console.warn(`Error parsing colors for product ${index + 1}:`, e)
          }
        }
        
        return {
          id: row.id || `product-${index + 1}`,
          name: row.name || row.nombre || 'Producto sin nombre',
          price: parseFloat(row.price || row.precio || '0'),
          image: row.image || row.imagen || '/placeholder-product.jpg',
          description: row.description || row.descripcion || '',
          category: row.category || row.categoria || 'general',
          colors
        }
      })
      .filter(product => product.name !== 'Producto sin nombre' && product.price > 0)
    
    if (products.length === 0) {
      console.log('No valid products found in CSV, using mock data')
      return NextResponse.json({ products: getMockProducts() })
    }
    
    return NextResponse.json({ products })
    
  } catch (error) {
    console.error('Error fetching products:', error)
    
    // Return mock data as fallback
    return NextResponse.json({ 
      products: getMockProducts(),
      error: 'Using mock data due to fetch error'
    })
  }
}