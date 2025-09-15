import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Preference, PreApproval } from 'mercadopago'

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
      const validBaseUrl = baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`

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
          email: donorInfo?.email || 'donante@example.com',
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
      // In development, return a mock response for testing UI
      if (process.env.NODE_ENV === 'development') {
        return NextResponse.json({
          id: `mock_subscription_${Date.now()}`,
          status: 'pending',
          init_point: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/donar/success?mock=subscription`,
          external_reference: `monthly_donation_${Date.now()}`,
          subscription_type: 'monthly',
          auto_recurring: {
            frequency: 1,
            frequency_type: 'months',
            transaction_amount: amount,
            currency_id: 'ARS'
          }
        })
      }

      const preApproval = new PreApproval(client)

      // Create subscription data for MercadoPago PreApproval
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
      const validBaseUrl = baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`
      
      console.log('Creating subscription with baseUrl:', validBaseUrl)
      
      const subscriptionData = {
        reason: `Donación mensual de $${amount} - Ser Galgos`,
        external_reference: `monthly_donation_${Date.now()}`,
        payer_email: donorInfo?.email || 'test_user_123@testuser.com',
        back_urls: {
          success: `${validBaseUrl}/donar/success`,
          failure: `${validBaseUrl}/donar/failure`,
          pending: `${validBaseUrl}/donar/pending`
        },
        auto_recurring: {
          frequency: 1,
          frequency_type: 'months',
          start_date: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString(), // Start tomorrow
          end_date: new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000).toISOString(), // End in 1 year
          transaction_amount: amount,
          currency_id: 'ARS'
        }
      }

      console.log('Subscription data:', JSON.stringify(subscriptionData, null, 2))

      const subscription = await preApproval.create({ body: subscriptionData })

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
    console.error('Error creating MercadoPago preference:', error)
    
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