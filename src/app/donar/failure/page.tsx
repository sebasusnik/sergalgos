import Link from 'next/link'
import { XCircle, RefreshCw, Home, MessageCircle } from 'lucide-react'

export default function DonationFailurePage() {
  return (
    <div className="bg-background font-sans min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-6">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="font-serif font-semibold text-3xl text-text-heading mb-2">
            Pago no procesado
          </h1>
          <p className="text-text-body text-lg">
            Hubo un problema con tu donación
          </p>
        </div>

        <div className="bg-surface rounded-xl border border-border p-6 mb-6">
          <h2 className="font-sans font-bold text-xl text-text-heading mb-3">
            ¿Qué pasó?
          </h2>
          <div className="text-text-body text-sm leading-relaxed space-y-2">
            <p>Tu donación no pudo ser procesada. Esto puede ocurrir por:</p>
            <ul className="list-disc list-inside space-y-1 text-left">
              <li>Fondos insuficientes</li>
              <li>Datos de tarjeta incorrectos</li>
              <li>Problemas temporales del sistema</li>
              <li>Transacción cancelada</li>
            </ul>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex flex-col gap-3">
            <Link 
              href="/donar"
              className="bg-primary text-text-on-primary font-bold py-3 px-6 rounded-full hover:bg-primary-hover transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Intentar nuevamente
            </Link>
            
            <a 
              href="https://wa.me/5491123456789?text=Hola!%20Tuve%20problemas%20para%20hacer%20una%20donaci%C3%B3n%20en%20la%20web.%20%C2%BFPodr%C3%ADan%20ayudarme%3F"
              className="border border-green-600 text-green-600 font-medium py-3 px-6 rounded-full hover:bg-green-50 transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Contactar por WhatsApp
            </a>

            <Link 
              href="/"
              className="border border-border text-text-muted font-medium py-3 px-6 rounded-full hover:bg-surface transition-colors flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Volver al inicio
            </Link>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 text-sm mb-2">
            Otras formas de donar
          </h3>
          <p className="text-blue-700 text-xs">
            También puedes hacer tu donación por transferencia bancaria. 
            Revisa los datos bancarios en la página de donaciones.
          </p>
        </div>
      </div>
    </div>
  )
}