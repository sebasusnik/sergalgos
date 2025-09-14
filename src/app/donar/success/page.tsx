'use client'

import Link from 'next/link'
import { CheckCircle, Heart, Home, Info } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function DonationSuccessContent() {
  const searchParams = useSearchParams()
  const isMockSubscription = searchParams.get('mock') === 'subscription'
  return (
    <div className="bg-background font-sans min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-6">
          {isMockSubscription ? (
            <>
              <Info className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <h1 className="font-serif font-semibold text-3xl text-text-heading mb-2">
                ¡Suscripción Configurada! (Modo Desarrollo)
              </h1>
              <p className="text-text-body text-lg">
                La funcionalidad de suscripciones está lista para producción
              </p>
            </>
          ) : (
            <>
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h1 className="font-serif font-semibold text-3xl text-text-heading mb-2">
                ¡Donación Exitosa!
              </h1>
              <p className="text-text-body text-lg">
                Muchas gracias por tu generosidad
              </p>
            </>
          )}
        </div>

        <div className="bg-surface rounded-xl border border-border p-6 mb-6">
          <Heart className="w-8 h-8 text-primary mx-auto mb-3" />
          {isMockSubscription ? (
            <>
              <h2 className="font-sans font-bold text-xl text-text-heading mb-3">
                Suscripción de Prueba Creada
              </h2>
              <p className="text-text-body text-sm leading-relaxed">
                En producción, aquí se procesaría una suscripción real de MercadoPago.
                El sistema está completamente implementado y listo para usar.
              </p>
            </>
          ) : (
            <>
              <h2 className="font-sans font-bold text-xl text-text-heading mb-3">
                Tu donación hace la diferencia
              </h2>
              <p className="text-text-body text-sm leading-relaxed">
                Gracias a tu apoyo podemos continuar rescatando galgos, brindándoles 
                atención veterinaria y encontrándoles hogares amorosos.
              </p>
            </>
          )}
        </div>

        <div className="space-y-3">
          {!isMockSubscription && (
            <p className="text-text-muted text-sm">
              Recibirás un comprobante por email en los próximos minutos.
            </p>
          )}
          
          {isMockSubscription && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-blue-800 text-sm">
                <strong>Nota para desarrollo:</strong> Esta es una respuesta simulada.
                En producción, el usuario sería redirigido a MercadoPago para completar
                la configuración de su suscripción mensual.
              </p>
            </div>
          )}
          
          <div className="flex flex-col gap-3">
            <Link 
              href="/"
              className="bg-primary text-text-on-primary font-bold py-3 px-6 rounded-full hover:bg-primary-hover transition-colors flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Volver al inicio
            </Link>
            
            <Link 
              href="/donar"
              className="border border-primary text-primary font-medium py-3 px-6 rounded-full hover:bg-primary/5 transition-colors"
            >
              Hacer otra donación
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-text-muted text-xs">
            ¿Tienes alguna pregunta? Contáctanos por{' '}
            <a 
              href="https://wa.me/5491123456789" 
              className="text-green-600 hover:text-green-700"
            >
              WhatsApp
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function DonationSuccessPage() {
  return (
    <Suspense fallback={
      <div className="bg-background font-sans min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="animate-pulse">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
            <div className="h-8 bg-gray-200 rounded mb-2 w-3/4 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </div>
    }>
      <DonationSuccessContent />
    </Suspense>
  )
}