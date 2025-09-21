import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Preference, PreApproval } from 'mercadopago'

// Function to create a test user for Argentina
async function createTestUser() {
  try {
    const response = await fetch('https://api.mercadopago.com/users/test_user', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        site_id: 'MLA' // Argentina site ID
      })
    })
    
    if (response.ok) {
      const testUser = await response.json()
      console.log('Created test user:', testUser.email)
      return testUser.email
    } else {
      console.error('Failed to create test user:', await response.text())
      return null
    }
  } catch (error) {
    console.error('Error creating test user:', error)
    return null
  }
}

// Initialize MercadoPago client
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
  options: {
    timeout: 5000,
    idempotencyKey: 'abc'
  }
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, donationType, donorInfo } = body

    // Debug logging
    console.log('=== DONATION API DEBUG ===')
    console.log('Request body:', { amount, donationType, donorInfo })
    console.log('MercadoPago Access Token exists:', !!process.env.MERCADOPAGO_ACCESS_TOKEN)
    console.log('Environment:', process.env.NODE_ENV)
    console.log('Base URL env vars:', {
      NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
      VERCEL_URL: process.env.VERCEL_URL
    })

    // Validate required fields
    if (!amount || amount < 100) {
      return NextResponse.json(
        { error: 'Monto mínimo requerido: $100' },
        { status: 400 }
      )
    }

    if (!donationType || !['one-time', 'monthly'].includes(donationType)) {
      return NextResponse.json(
        { error: 'Tipo de donación inválido' },
        { status: 400 }
      )
    }

    // Create preference for one-time donations
    if (donationType === 'one-time') {
      const preference = new Preference(client)
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
      // We can either use a service like ngrok or omit the back_url for testing
      if (validBaseUrl.includes('localhost')) {
        // Option 1: Use a test webhook service
        validBaseUrl = 'https://httpbin.org/status/200'
        console.log('Development mode: Using test URL for back_url')
        console.log('Note: In production, set NEXT_PUBLIC_BASE_URL to your domain')
      }

      const preferenceData = {
        items: [
          {
            id: 'donation',
            title: 'Donación para Ser Galgos',
            description: 'Tu donación nos ayuda a rescatar y cuidar más galgos',
            quantity: 1,
            unit_price: amount,
            currency_id: 'ARS'
          }
        ],
        payer: {
          name: donorInfo?.name || 'Donante Anónimo',
          email: donorInfo?.email || (process.env.NODE_ENV === 'production' 
            ? 'donante@sergalgos.com'  // Production fallback
            : 'test_user_argentina@testuser.com'),  // Sandbox fallback
        },
        payment_methods: {
          excluded_payment_types: [],
          excluded_payment_methods: [],
          installments: 12
        },
        back_urls: {
          success: `${validBaseUrl}/donar/success`,
          failure: `${validBaseUrl}/donar/failure`,
          pending: `${validBaseUrl}/donar/pending`
        },
        // auto_return: 'approved',
        notification_url: `${validBaseUrl}/api/donations/webhook`,
        external_reference: `donation_${Date.now()}`,
        expires: true,
        expiration_date_from: new Date().toISOString(),
        expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
        metadata: {
          donor_info: JSON.stringify(donorInfo || {}),
          donation_type: donationType,
          organization: 'Ser Galgos'
        }
      }

      const response = await preference.create({ body: preferenceData })

      return NextResponse.json({
        id: response.id,
        init_point: response.init_point,
        sandbox_init_point: response.sandbox_init_point,
        external_reference: response.external_reference
      })
    }

    // For monthly donations, create a subscription using PreApproval
    if (donationType === 'monthly') {
      const preApproval = new PreApproval(client)

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
      // We can either use a service like ngrok or omit the back_url for testing
      if (validBaseUrl.includes('localhost')) {
        // Option 1: Use a test webhook service
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
      console.log('- Access Token type:', process.env.MERCADOPAGO_ACCESS_TOKEN?.substring(0, 10) + '...')
      
      // Create subscription data according to MercadoPago documentation
      const subscriptionData = {
        reason: `Donación mensual de $${amount} - Ser Galgos`,
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
    }

  } catch (error) {
    console.error('Error creating MercadoPago preference/subscription:', error)
    
    // Log more details for debugging
    if (error && typeof error === 'object') {
      console.error('Error details:', JSON.stringify(error, null, 2))
    }
    
    return NextResponse.json(
      { 
        error: 'Error interno del servidor. Por favor, intenta nuevamente.',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    )
  }
}

// Handle webhook notifications from MercadoPago
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, data } = body

    // Log the webhook for debugging
    console.log('MercadoPago webhook received:', { type, data })

    // Handle different notification types
    switch (type) {
      case 'payment':
        // Handle payment notifications
        console.log('Payment notification received:', data)
        // Here you would typically:
        // 1. Verify the payment status
        // 2. Update your database
        // 3. Send confirmation emails
        // 4. Update donation records
        break
        
      case 'merchant_order':
        // Handle merchant order notifications
        console.log('Merchant order notification:', data)
        break
        
      default:
        console.log('Unknown notification type:', type)
    }

    // Always return 200 to acknowledge receipt
    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Error processing webhook:', error)
    // Still return 200 to prevent MercadoPago from retrying
    return NextResponse.json({ error: 'Webhook processing failed' })
  }
}