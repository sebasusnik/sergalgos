# Donations API Route - MercadoPago Integration

This API route (`/api/donations`) handles donation processing through MercadoPago integration for the Sergalgos application.

## Overview

- **Endpoint**: `POST /api/donations`
- **Integration**: MercadoPago Payment Preferences API
- **Response**: Redirects to MercadoPago checkout or returns error
- **Webhook**: `PUT /api/donations` for payment notifications

## Environment Variables Required

```bash
# MercadoPago Access Token (from your MercadoPago application)
MERCADOPAGO_ACCESS_TOKEN=your-access-token-here

# Base URL for redirect URLs (production URL when deployed)
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

## API Request Format

### POST /api/donations

```json
{
  "amount": 10000,
  "donationType": "one-time",
  "donorInfo": {
    "name": "Juan Pérez",
    "email": "juan@example.com"
  }
}
```

### Response Format

**Success (one-time donation):**
```json
{
  "id": "mercadopago-preference-id",
  "init_point": "https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=...",
  "sandbox_init_point": "https://sandbox.mercadopago.com.ar/checkout/v1/redirect?pref_id=...",
  "external_reference": "donation_1234567890"
}
```

**Monthly donations (not yet implemented):**
```json
{
  "error": "Las donaciones mensuales estarán disponibles próximamente...",
  "fallback_action": "contact_whatsapp"
}
```

**Error:**
```json
{
  "error": "Monto mínimo requerido: $100"
}
```

## MercadoPago Setup

### 1. Create MercadoPago Application

1. Go to [MercadoPago Developers](https://www.mercadopago.com.ar/developers/)
2. Create a new application
3. Get your **Access Token** from the credentials section
4. Configure your application URLs:
   - Success URL: `https://yourdomain.com/donar/success`
   - Failure URL: `https://yourdomain.com/donar/failure`
   - Pending URL: `https://yourdomain.com/donar/pending`
   - Webhook URL: `https://yourdomain.com/api/donations`

### 2. Environment Configuration

Add to your `.env.local`:

```bash
MERCADOPAGO_ACCESS_TOKEN=your_access_token_here
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

### 3. Webhook Configuration

The API automatically handles webhook notifications at `PUT /api/donations`. Configure this URL in your MercadoPago application settings.

## Payment Flow

1. **User submits donation form** → Frontend sends POST to `/api/donations`
2. **API creates MercadoPago Preference** → Returns `init_point` URL
3. **User redirects to MercadoPago** → Completes payment
4. **MercadoPago redirects back** → To success/failure/pending pages
5. **MercadoPago sends webhook** → API receives payment notification

## Donation Types

### One-time Donations ✅

- Fully implemented
- Creates MercadoPago payment preference
- Supports all MercadoPago payment methods
- Installment options up to 12 months

### Monthly Donations ⏳

- Planned for future implementation
- Currently redirects to WhatsApp for manual setup
- Requires MercadoPago Subscriptions API integration

## Payment Methods Supported

- **Credit/Debit Cards**: Visa, Mastercard, American Express
- **Bank Transfer**: All major Argentine banks
- **Cash Payments**: Rapipago, Pago Fácil, Provincia NET
- **Digital Wallets**: Mercado Pago account balance

## Result Pages

### Success Page (`/donar/success`)
- Displays when payment is approved
- Thank you message
- Links to home and make another donation
- WhatsApp contact option

### Failure Page (`/donar/failure`)
- Displays when payment fails or is rejected
- Error explanation
- Retry option
- Alternative contact methods
- Bank transfer information

### Pending Page (`/donar/pending`)
- Displays when payment is pending approval
- Common for cash payments and bank transfers
- Status check instructions
- Expected processing timeframes

## Security Features

- **Input Validation**: Amount limits and required fields
- **External Reference**: Unique transaction identifiers
- **Webhook Verification**: MercadoPago signature validation (to be implemented)
- **Timeout Handling**: 24-hour payment preference expiration
- **Error Handling**: Comprehensive error messages and fallbacks

## Error Handling

The API includes robust error handling:

1. **Validation Errors**: Invalid amounts or donation types
2. **MercadoPago Errors**: API connection issues or invalid tokens
3. **Server Errors**: Graceful degradation with detailed logging
4. **Webhook Errors**: Handles notification processing failures

## Testing

### Development Mode

1. Use MercadoPago test credentials
2. Set `NEXT_PUBLIC_BASE_URL=http://localhost:3000`
3. Test with MercadoPago test cards

### Test Credit Cards

```
Approved: 4509 9535 6623 3704
Rejected: 4018 7000 0000 0002
Pending: 4389 3540 6624 5071
```

## Monitoring & Analytics

### Webhook Logging

All webhook events are logged to console:
- Payment notifications
- Status changes
- Failed transactions

### Recommended Monitoring

- Track donation success rates
- Monitor failed payment reasons
- Alert on webhook failures
- Track processing times

## Future Enhancements

1. **Monthly Subscriptions**: Implement recurring donations
2. **Webhook Verification**: Add MercadoPago signature validation
3. **Database Integration**: Store donation records
4. **Email Notifications**: Send receipts and confirmations
5. **Analytics Dashboard**: Track donation metrics
6. **Multi-currency Support**: USD, EUR support
7. **Custom Amounts**: More flexible donation amounts
8. **Donor Profiles**: Save donor information for future donations

## Troubleshooting

### Common Issues

1. **Invalid Access Token**
   - Check token is correct and not expired
   - Ensure using production token in production

2. **Redirect URL Errors**
   - Verify `NEXT_PUBLIC_BASE_URL` is correct
   - Check URL accessibility from MercadoPago

3. **Webhook Not Receiving**
   - Verify webhook URL is publicly accessible
   - Check MercadoPago application settings
   - Review server logs for errors

4. **Payment Stuck in Pending**
   - Normal for cash payments
   - Check MercadoPago dashboard
   - Contact MercadoPago support if needed

### Debug Mode

Set `NODE_ENV=development` to see detailed error information in API responses.

### Support

For MercadoPago-specific issues:
- [MercadoPago Developers Documentation](https://www.mercadopago.com.ar/developers/)
- [MercadoPago Support](https://www.mercadopago.com.ar/ayuda)

For application issues:
- Check server logs
- Verify environment variables
- Test with MercadoPago sandbox