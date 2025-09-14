import { Product } from '../contexts/cart-context'

export async function fetchProductsFromSheet(): Promise<Product[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/products`, {
      next: { revalidate: 3600 } // Revalidate every hour
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`)
    }
    
    const data = await response.json()
    return data.products || []
    
  } catch (error) {
    console.error('Error fetching products from API:', error)
    // Return empty array, API route handles fallback to mock data
    return []
  }
}

