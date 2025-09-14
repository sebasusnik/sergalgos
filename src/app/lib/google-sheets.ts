import { Product } from '../contexts/cart-context'

export async function fetchProductsFromSheet(): Promise<Product[]> {
  try {
    const response = await fetch('/api/products', {
      cache: 'no-store' // Always fetch fresh data
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

