'use client'

import { useCart } from '../contexts/cart-context'
import { ShoppingCart, Minus, Plus, Trash2, MessageCircle } from 'lucide-react'
import { openWhatsAppCheckout } from '../lib/whatsapp-checkout'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '../ui/components/sheet'

export default function Cart() {
  const { items, total, itemCount, updateQuantity, removeItem, clearCart } = useCart()

  const handleQuantityChange = (id: string, selectedColor: string | undefined, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id, selectedColor)
    } else {
      updateQuantity(id, selectedColor, newQuantity)
    }
  }

  const handleWhatsAppCheckout = () => {
    const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '5491123456789'
    openWhatsAppCheckout(items, total, {
      phoneNumber,
      greeting: 'Hola! Me interesa comprar los siguientes productos:'
    })
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="relative p-2 bg-surface rounded-full border border-border hover:bg-primary-light transition-colors">
          <ShoppingCart className="w-5 h-5 text-text-heading" />
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-text-on-primary text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
              {itemCount}
            </span>
          )}
        </button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-sans font-bold text-text-heading text-xl">
            Carrito ({itemCount})
          </SheetTitle>
        </SheetHeader>

        {/* Cart Content */}
        <div className="flex-1 overflow-y-auto py-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-12 h-12 text-text-muted mx-auto mb-4" />
              <p className="text-text-muted">Tu carrito está vacío</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.id}-${item.selectedColor || 'default'}`}
                  className="flex items-center gap-3 p-3 bg-surface rounded-lg border border-border"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = `https://placehold.co/64x64/F3F4F6/9CA3AF?text=${encodeURIComponent(item.name.charAt(0))}`
                    }}
                  />
                  
                  <div className="flex-1">
                    <h3 className="font-medium text-text-heading text-sm leading-5">
                      {item.name}
                    </h3>
                    <p className="text-text-muted text-xs">
                      ${item.price.toLocaleString()} c/u
                      {item.selectedColor && ` • ${item.selectedColor}`}
                    </p>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.selectedColor, item.quantity - 1)}
                        className="p-1 hover:bg-primary-light rounded transition-colors"
                      >
                        <Minus className="w-3 h-3 text-text-heading" />
                      </button>
                      
                      <span className="mx-2 text-sm font-medium text-text-heading min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      
                      <button
                        onClick={() => handleQuantityChange(item.id, item.selectedColor, item.quantity + 1)}
                        className="p-1 hover:bg-primary-light rounded transition-colors"
                      >
                        <Plus className="w-3 h-3 text-text-heading" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-medium text-text-heading text-sm">
                      ${(item.price * item.quantity).toLocaleString()}
                    </p>
                    <button
                      onClick={() => removeItem(item.id, item.selectedColor)}
                      className="p-1 hover:bg-red-100 rounded transition-colors mt-1"
                    >
                      <Trash2 className="w-3 h-3 text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <SheetFooter>
            <div className="w-full space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-sans font-bold text-text-heading text-lg">
                  Total: ${total.toLocaleString()}
                </span>
                <button
                  onClick={clearCart}
                  className="text-text-muted hover:text-red-500 text-sm transition-colors"
                >
                  Vaciar carrito
                </button>
              </div>
              
              <button 
                onClick={handleWhatsAppCheckout}
                className="w-full bg-green-600 text-white font-bold py-3 px-6 rounded-full hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Comprar por WhatsApp
              </button>
              
              <p className="text-center text-text-muted text-xs">
                Los fondos ayudan a rescatar más galgos
              </p>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}