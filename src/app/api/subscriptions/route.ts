import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, PreApproval } from 'mercadopago'

// Initialize MercadoPago client
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
  options: {
    timeout: 5000,
  }
})

// GET - Retrieve subscription details
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const subscriptionId = url.searchParams.get('id')

    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'Subscription ID is required' },
        { status: 400 }
      )
    }

    const preApproval = new PreApproval(client)
    const subscription = await preApproval.get({ id: subscriptionId })

    return NextResponse.json({
      id: subscription.id,
      status: subscription.status,
      reason: subscription.reason,
      external_reference: subscription.external_reference,
      payer_email: subscription.payer_email,
      auto_recurring: subscription.auto_recurring,
      date_created: subscription.date_created,
      last_modified: subscription.last_modified
    })

  } catch (error) {
    console.error('Error retrieving subscription:', error)
    
    return NextResponse.json(
      { 
        error: 'Error retrieving subscription details',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    )
  }
}

// PUT - Update subscription (pause/resume/cancel)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { subscriptionId, action } = body

    if (!subscriptionId || !action) {
      return NextResponse.json(
        { error: 'Subscription ID and action are required' },
        { status: 400 }
      )
    }

    const preApproval = new PreApproval(client)
    
    let updateData = {}
    
    switch (action) {
      case 'pause':
        updateData = { status: 'paused' }
        break
      case 'resume':
        updateData = { status: 'authorized' }
        break
      case 'cancel':
        updateData = { status: 'cancelled' }
        break
      default:
        return NextResponse.json(
          { error: 'Invalid action. Allowed: pause, resume, cancel' },
          { status: 400 }
        )
    }

    const updatedSubscription = await preApproval.update({
      id: subscriptionId,
      body: updateData
    })

    return NextResponse.json({
      id: updatedSubscription.id,
      status: updatedSubscription.status,
      message: `Subscription ${action}d successfully`
    })

  } catch (error) {
    console.error('Error updating subscription:', error)
    
    return NextResponse.json(
      { 
        error: 'Error updating subscription',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    )
  }
}

// POST - Create a new subscription
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, donorInfo, reason } = body

    // Validate required fields
    if (!amount || amount < 100) {
      return NextResponse.json(
        { error: 'Monto mínimo requerido: $100' },
        { status: 400 }
      )
    }

    // Get base URL for redirect URLs
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL || 'http://localhost:3000'
    
    // Validate baseUrl
    if (!baseUrl || baseUrl.includes('undefined')) {
      console.error('Invalid baseUrl:', baseUrl)
      return NextResponse.json(
        { error: 'URL base no configurada correctamente' },
        { status: 500 }
      )
    }

    // Ensure baseUrl starts with http/https
    let validBaseUrl = baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`
    
    // For development, MercadoPago doesn't accept localhost URLs
    // We can either use a service like ngrok or use a test URL
    if (validBaseUrl.includes('localhost')) {
      validBaseUrl = 'https://httpbin.org/status/200'
      console.log('Development mode: Using test URL for back_url')
      console.log('Note: In production, set NEXT_PUBLIC_BASE_URL to your domain')
    }
    
    // Determine payer email - use test user for sandbox or actual donor email
    // APP_USR tokens can be both sandbox and production, we need to check the environment
    const isProduction = process.env.NODE_ENV === 'production'
    let payerEmail
    
    if (isProduction) {
      // Production: use actual donor email or fallback
      payerEmail = donorInfo?.email || 'donante@sergalgos.com'
    } else {
      // Development/Sandbox: use the provided email or fallback to test user
      // In development, we'll use the actual email since we're collecting it from the form
      payerEmail = donorInfo?.email || 'test_user_argentina@testuser.com'
    }
    
    console.log('Creating subscription:')
    console.log('- Environment:', isProduction ? 'Production' : 'Sandbox')
    console.log('- Amount:', amount)
    console.log('- Payer email:', payerEmail)
    console.log('- Base URL:', validBaseUrl)
    
    const preApproval = new PreApproval(client)
    
    // Create subscription data according to MercadoPago documentation
    const subscriptionData = {
      reason: reason || `Donación mensual de $${amount} - Ser Galgos`,
      external_reference: `monthly_donation_${Date.now()}`,
      payer_email: payerEmail,
      back_url: `${validBaseUrl}/donar/success`,
        auto_recurring: {
          frequency: 1,
          frequency_type: 'months',
          transaction_amount: amount,
          currency_id: 'ARS',
          // Start date should be in the future (at least 1 day) - ISO 8601 format
          start_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Full ISO 8601 format
          // End date optional - if not provided, subscription continues indefinitely
          end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year from now
        },
      status: 'pending' // Let MercadoPago handle authorization
    }

    console.log('Subscription data:', JSON.stringify(subscriptionData, null, 2))

    const subscription = await preApproval.create({ body: subscriptionData })

    console.log('Subscription created:', {
      id: subscription.id,
      status: subscription.status,
      init_point: subscription.init_point
    })

    return NextResponse.json({
      id: subscription.id,
      status: subscription.status,
      init_point: subscription.init_point,
      external_reference: subscription.external_reference,
      subscription_type: 'monthly',
      auto_recurring: subscription.auto_recurring
    })

  } catch (error) {
    console.error('Error creating subscription:', error)
    
    // Log more details for debugging
    if (error && typeof error === 'object') {
      console.error('Error details:', JSON.stringify(error, null, 2))
    }
    
    return NextResponse.json(
      { 
        error: 'Error creando la suscripción. Por favor, intenta nuevamente.',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    )
  }
}

// Handle subscription webhooks - moved to PATCH method
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, data } = body

    // Log the webhook for debugging
    console.log('Subscription webhook received:', { type, data })

    // Handle different subscription notification types
    switch (type) {
      case 'preapproval':
        console.log('Subscription notification received:', data)
        // Handle subscription status changes
        // You can implement logic to:
        // 1. Update subscription status in your database
        // 2. Send confirmation emails to donors
        // 3. Update donor records
        // 4. Handle failed payments
        break
        
      case 'authorized_payment':
        console.log('Subscription payment authorized:', data)
        // Handle successful recurring payment
        break
        
      case 'payment':
        console.log('Subscription payment notification:', data)
        // Handle payment notifications for subscriptions
        break
        
      default:
        console.log('Unknown subscription notification type:', type)
    }

    // Always return 200 to acknowledge receipt
    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Error processing subscription webhook:', error)
    // Still return 200 to prevent MercadoPago from retrying
    return NextResponse.json({ error: 'Webhook processing failed' })
  }
}