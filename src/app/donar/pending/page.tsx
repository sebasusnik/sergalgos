'use client'

import Link from 'next/link'
import { Clock, Home, MessageCircle, RefreshCw } from 'lucide-react'
import Container from '../../components/container'

export default function DonationPendingPage() {
  return (
    <div className="bg-background font-sans min-h-screen flex items-center justify-center">
      <Container>
        <div className="max-w-md mx-auto text-center">
        <div className="mb-6">
          <Clock className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="font-serif font-semibold text-3xl text-text-heading mb-2">
            Pago Pendiente
          </h1>
          <p className="text-text-body text-lg">
            Tu donación está siendo procesada
          </p>
        </div>

        <div className="bg-surface rounded-xl border border-border p-6 mb-6">
          <h2 className="font-sans font-bold text-xl text-text-heading mb-3">
            ¿Qué sigue?
          </h2>
          <div className="text-text-body text-sm leading-relaxed space-y-3">
            <p>
              Tu donación está pendiente de confirmación. Esto puede ocurrir cuando:
            </p>
            <ul className="list-disc list-inside space-y-1 text-left">
              <li>Elegiste pago en efectivo (Rapipago, Pago Fácil)</li>
              <li>Transferencia bancaria en proceso</li>
              <li>Verificación adicional requerida</li>
            </ul>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-yellow-800 text-sm mb-2">
            📧 Te mantemos informado
          </h3>
          <p className="text-yellow-700 text-xs">
            Recibirás una notificación por email cuando tu donación sea confirmada.
            Esto puede tomar entre unos minutos y 24 horas.
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex flex-col gap-3">
            <Link 
              href="/"
              className="bg-primary text-text-on-primary font-bold py-3 px-6 rounded-full hover:bg-primary-hover transition-colors flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Volver al inicio
            </Link>
            
            <button 
              onClick={() => window.location.reload()}
              className="border border-primary text-primary font-medium py-3 px-6 rounded-full hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Actualizar estado
            </button>

            <a 
              href="https://wa.me/5491123456789?text=Hola!%20Hice%20una%20donaci%C3%B3n%20que%20est%C3%A1%20pendiente%20y%20quer%C3%ADa%20consultar%20el%20estado."
              className="border border-green-600 text-green-600 font-medium py-3 px-6 rounded-full hover:bg-green-50 transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Consultar por WhatsApp
            </a>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-text-muted text-xs">
            ¿Necesitas ayuda? Estamos disponibles por{' '}
            <a 
              href="https://wa.me/5491123456789" 
              className="text-green-600 hover:text-green-700"
            >
              WhatsApp
            </a>
            {' '}o email a{' '}
            <a 
              href="mailto:donaciones@sergalgos.org" 
              className="text-primary hover:text-primary-hover"
            >
              donaciones@sergalgos.org
            </a>
          </p>
        </div>
        </div>
      </Container>
    </div>
  )
}