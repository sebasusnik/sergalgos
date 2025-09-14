import { CartItem } from '../contexts/cart-context'

interface WhatsAppCheckoutOptions {
  phoneNumber: string
  greeting?: string
}

export function generateWhatsAppCheckoutUrl(
  items: CartItem[],
  total: number,
  options: WhatsAppCheckoutOptions
): string {
  const { phoneNumber, greeting = 'Hola! Me interesa comprar los siguientes productos:' } = options

  // Generate order summary
  const orderItems = items.map(item => {
    const itemText = `• ${item.name}`
    const colorText = item.selectedColor ? ` (${item.selectedColor})` : ''
    const quantityText = item.quantity > 1 ? ` x${item.quantity}` : ''
    const priceText = ` - $${(item.price * item.quantity).toLocaleString()}`
    return itemText + colorText + quantityText + priceText
  }).join('\n')

  const message = `${greeting}

${orderItems}

*Total: $${total.toLocaleString()}*

¿Podrían confirmarme la disponibilidad y el método de pago? ¡Gracias!`

  // Encode message for URL
  const encodedMessage = encodeURIComponent(message)
  
  // Create WhatsApp URL
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`
  
  return whatsappUrl
}

export function openWhatsAppCheckout(
  items: CartItem[],
  total: number,
  options: WhatsAppCheckoutOptions
): void {
  const url = generateWhatsAppCheckoutUrl(items, total, options)
  window.open(url, '_blank')
}