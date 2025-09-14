import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { secret, tags } = body

    // Verify the secret
    if (!secret || secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json(
        { error: 'Invalid secret' },
        { status: 401 }
      )
    }

    // Validate tags
    if (!tags || !Array.isArray(tags) || tags.length === 0) {
      return NextResponse.json(
        { error: 'Tags array is required' },
        { status: 400 }
      )
    }

    // Revalidate each tag
    const results = []
    for (const tag of tags) {
      try {
        revalidateTag(tag)
        results.push({ tag, status: 'success' })
        console.log(`✅ Revalidated tag: ${tag}`)
      } catch (error) {
        console.error(`❌ Failed to revalidate tag ${tag}:`, error)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        results.push({ tag, status: 'error', error: errorMessage })
      }
    }

    return NextResponse.json({
      message: 'Revalidation completed',
      results,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Revalidation webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    message: 'Revalidate webhook is running',
    timestamp: new Date().toISOString()
  })
}