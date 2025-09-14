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

// POST - Handle subscription webhooks
export async function POST(request: NextRequest) {
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