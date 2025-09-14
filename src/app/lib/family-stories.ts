import { FamilyStory } from '../contexts/cart-context'

export async function fetchFamilyStories(): Promise<FamilyStory[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/stories`, {
      next: { revalidate: 3600 } // Revalidate every hour
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch family stories: ${response.statusText}`)
    }
    
    const data = await response.json()
    return data.stories || []
    
  } catch (error) {
    console.error('Error fetching family stories from API:', error)
    // Return empty array, API route handles fallback to mock data
    return []
  }
}