import { FamilyStory } from '../contexts/cart-context'

async function fetchStories(): Promise<FamilyStory[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/stories`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch stories: ${response.statusText}`)
    }
    
    const data = await response.json()
    return data.stories || []
  } catch (error) {
    console.error('Error fetching stories:', error)
    return []
  }
}

export async function FamilyStories() {
  const stories = await fetchStories()

  return (
    <div>
      <h2 className="font-sans font-bold text-text-heading text-2xl leading-7 mb-6">
        Historias de las familias
      </h2>
      <div className="flex flex-col md:flex-row gap-6">
        {stories.slice(0, 3).map((story) => (
          <div key={story.id} className="flex flex-col w-full gap-3">
            <img
              className="w-full h-44 object-cover rounded-xl"
              src={story.image}
              alt={`Un galgo llamado ${story.dogName}`}
            />
            <div>
              <h3 className="font-sans font-medium text-text-heading text-base leading-6">
                {story.ownerName}
              </h3>
              <p className="font-sans font-normal text-text-muted text-sm leading-[21px]">
                "{story.testimonial}"
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}