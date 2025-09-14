import { NextResponse } from 'next/server'
import Papa from 'papaparse'
import { FamilyStory } from '../../contexts/cart-context'

interface CSVRow {
  id?: string
  dogName?: string
  nombre_perro?: string
  ownerName?: string
  nombre_dueno?: string
  testimonial?: string
  testimonio?: string
  image?: string
  imagen?: string
}

// Mock stories como fallback
function getMockStories(): FamilyStory[] {
  return [
    {
      id: '1',
      dogName: 'Luna',
      ownerName: 'Malvina',
      testimonial: 'Luna ha traído tanta alegría a nuestras vidas. Es la perra más dulce que podríamos pedir.',
      image: 'https://placehold.co/400x300/FFE4E6/DC2626?text=Luna'
    },
    {
      id: '2',
      dogName: 'Max',
      ownerName: 'Macarena',
      testimonial: 'Max se adaptó rápidamente a nuestro hogar y ahora es un miembro querido de nuestra familia.',
      image: 'https://placehold.co/400x300/E0E7FF/4F46E5?text=Max'
    },
    {
      id: '3',
      dogName: 'Bella',
      ownerName: 'Carlos',
      testimonial: 'Bella es tan cariñosa y gentil. No podemos imaginar nuestras vidas sin ella.',
      image: 'https://placehold.co/400x300/FEF3C7/F59E0B?text=Bella'
    }
  ]
}

export async function GET() {
  try {
    const csvUrl = process.env.GOOGLE_SHEETS_STORIES_CSV_URL
    
    if (!csvUrl) {
      console.log('No stories CSV URL configured, using mock data')
      return NextResponse.json({ stories: getMockStories() })
    }

    // Fetch CSV data with cache tag for revalidation
    const response = await fetch(csvUrl, {
      next: { 
        tags: ['stories'],
        revalidate: 300 // 5 minutes default cache
      },
      redirect: 'follow', // Explicitly follow redirects
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch stories CSV: ${response.statusText}`)
    }
    
    const csvData = await response.text()
    
    // Parse CSV with Papa Parse
    const parseResult = Papa.parse<CSVRow>(csvData, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header: string) => header.toLowerCase().trim()
    })
    
    if (parseResult.errors.length > 0) {
      console.warn('Stories CSV parsing errors:', parseResult.errors)
    }
    
    // Transform CSV rows to FamilyStory objects
    const stories: FamilyStory[] = parseResult.data
      .map((row, index) => ({
        id: row.id || `story-${index + 1}`,
        dogName: row.dogName || row.nombre_perro || 'Galgo',
        ownerName: row.ownerName || row.nombre_dueno || 'Familia adoptiva',
        testimonial: row.testimonial || row.testimonio || '',
        image: row.image || row.imagen || '/placeholder-dog.jpg'
      }))
      .filter(story => story.testimonial.trim() !== '')
    
    if (stories.length === 0) {
      console.log('No valid stories found in CSV, using mock data')
      return NextResponse.json({ stories: getMockStories() })
    }
    
    return NextResponse.json({ stories })
    
  } catch (error) {
    console.error('Error fetching family stories:', error)
    
    // Return mock data as fallback
    return NextResponse.json({ 
      stories: getMockStories(),
      error: 'Using mock data due to fetch error'
    })
  }
}