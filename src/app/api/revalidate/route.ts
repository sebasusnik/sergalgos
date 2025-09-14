import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Revalidation request received from:', request.headers.get('user-agent'))
    
    const body = await request.json()
    const { secret, tags } = body
    
    console.log('📝 Request body:', { secretProvided: !!secret, tags })

    // Verify the secret
    if (!secret || secret !== process.env.REVALIDATE_SECRET) {
      console.log('❌ Invalid secret provided')
      return NextResponse.json(
        { error: 'Invalid secret' },
        { 
          status: 401,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        }
      )
    }

    // Validate tags
    if (!tags || !Array.isArray(tags) || tags.length === 0) {
      return NextResponse.json(
        { error: 'Tags array is required' },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        }
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

    console.log('✅ Revalidation completed:', results)
    
    return NextResponse.json({
      message: 'Revalidation completed',
      results,
      timestamp: new Date().toISOString()
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    })

  } catch (error) {
    console.error('Revalidation webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      }
    )
  }
}

// CORS preflight handler
export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  })
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    message: 'Revalidate webhook is running',
    timestamp: new Date().toISOString()
  }, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  })
}
