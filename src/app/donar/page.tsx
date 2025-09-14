'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'

const donationSchema = z.object({
  amount: z.number().min(100, 'El monto mínimo es $100').max(1000000, 'El monto máximo es $1.000.000'),
  donationType: z.enum(['one-time', 'monthly']),
  customAmount: z.string().optional(),
})

type DonationFormData = z.infer<typeof donationSchema>

export default function DonarPage(): React.ReactElement {
  const [error, setError] = useState<string | null>(null)
  
  const suggestedAmounts = [
    { amount: 5000, description: "Comida por una semana" },
    { amount: 10000, description: "Vacunas y desparasitación" },
    { amount: 25000, description: "Tratamiento veterinario" },
    { amount: 50000, description: "Castración y microchip" }
  ]

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting, isValid }
  } = useForm<DonationFormData>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      amount: 0,
      donationType: 'one-time',
      customAmount: ''
    },
    mode: 'onChange'
  })

  const watchAmount = watch('amount')
  const watchDonationType = watch('donationType')
  const watchCustomAmount = watch('customAmount')

  const handleAmountSelect = (amount: number) => {
    setValue('amount', amount, { shouldValidate: true })
    setValue('customAmount', '')
  }

  const handleCustomAmountChange = (value: string) => {
    const numValue = parseInt(value) || 0
    setValue('customAmount', value)
    setValue('amount', numValue, { shouldValidate: true })
  }

  const onSubmit = async (data: DonationFormData) => {
    try {
      setError(null)
      
      const response = await fetch('/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: data.amount,
          donationType: data.donationType,
          donorInfo: {
            // You could extend the form to collect donor info
            name: 'Donante Anónimo',
            email: 'donante@example.com'
          }
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Error procesando la donación')
      }

      // Redirect to MercadoPago (works for both one-time donations and subscriptions)
      if (result.init_point) {
        window.location.href = result.init_point
      }
    } catch (error) {
      console.error('Error processing donation:', error)
      setError(error instanceof Error ? error.message : 'Error procesando la donación. Por favor intentá de nuevo.')
    }
  }

  return (
    <div className="bg-background font-sans pb-20 md:pb-0">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-serif font-semibold text-4xl text-text-heading mb-4">
            Ayudanos a salvar más galgos
          </h1>
          <p className="text-text-body text-lg leading-relaxed">
            Tu donación nos permite continuar rescatando, cuidando y encontrando hogares 
            amorosos para galgos que necesitan una segunda oportunidad.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid md:grid-cols-2 gap-8">
          {/* Donation Options */}
          <div className="bg-surface rounded-xl border border-border p-6">
            <h2 className="font-sans font-bold text-2xl text-text-heading mb-6">
              Opciones de Donación
            </h2>
            
            {/* Quick Amounts */}
            <div className="mb-6">
              <h3 className="font-medium text-text-heading mb-3">Montos sugeridos</h3>
              <div className="grid grid-cols-2 gap-3">
                {suggestedAmounts.map(({ amount, description }) => (
                  <button
                    type="button"
                    key={amount}
                    onClick={() => handleAmountSelect(amount)}
                    className={`p-3 border rounded-lg transition-colors text-center ${
                      watchAmount === amount && !watchCustomAmount
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary hover:bg-primary/5'
                    }`}
                  >
                    <span className="font-medium">${amount.toLocaleString()}</span>
                    <div className="text-sm text-text-muted mt-1">
                      {description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amount */}
            <div className="mb-6">
              <h3 className="font-medium text-text-heading mb-3">Monto personalizado</h3>
              <div className="flex">
                <span className="bg-border text-text-muted px-3 py-2 rounded-l-lg border border-r-0 border-border">
                  $
                </span>
                <input
                  type="number"
                  value={watchCustomAmount}
                  onChange={(e) => handleCustomAmountChange(e.target.value)}
                  placeholder="Ingresá tu monto"
                  className={`flex-1 px-3 py-2 border rounded-r-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none ${
                    errors.amount ? 'border-red-500' : 'border-border'
                  }`}
                />
              </div>
              {errors.amount && (
                <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
              )}
            </div>

            {/* Donation Type Toggle */}
            <div className="mb-6">
              <h3 className="font-medium text-text-heading mb-3">Tipo de donación</h3>
              <div className="flex gap-2 p-1 bg-background rounded-lg border border-border">
                <button
                  type="button"
                  onClick={() => setValue('donationType', 'one-time', { shouldValidate: true })}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    watchDonationType === 'one-time'
                      ? 'bg-primary text-text-on-primary'
                      : 'text-text-muted hover:text-text-heading'
                  }`}
                >
                  Una vez
                </button>
                <button
                  type="button"
                  onClick={() => setValue('donationType', 'monthly', { shouldValidate: true })}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    watchDonationType === 'monthly'
                      ? 'bg-primary text-text-on-primary'
                      : 'text-text-muted hover:text-text-heading'
                  }`}
                >
                  Mensual
                </button>
              </div>
            </div>

            {/* Amount Summary */}
            {watchAmount > 0 && (
              <div className="mb-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                <div className="text-center">
                  <span className="text-lg font-bold text-primary">
                    ${watchAmount.toLocaleString()}
                  </span>
                  <span className="text-sm text-text-muted ml-2">
                    ({watchDonationType === 'monthly' ? 'por mes' : 'donación única'})
                  </span>
                </div>
              </div>
            )}

            {/* API Error */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">
                  {error}
                </p>
              </div>
            )}

            {/* Form Validation Error */}
            {Object.keys(errors).length > 0 && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">
                  Por favor corregí los errores antes de continuar.
                </p>
              </div>
            )}

            {/* MercadoPago Button */}
            <div className="space-y-3">
              <button 
                type="submit"
                disabled={!isValid || isSubmitting || watchAmount === 0}
                className={`w-full font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                  isValid && !isSubmitting && watchAmount > 0
                    ? 'bg-blue-400 text-text-on-primary hover:bg-blue-500'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                {isSubmitting ? 'Procesando...' : `${watchDonationType === 'monthly' ? 'Suscribirse' : 'Donar'} con MercadoPago`}
              </button>
            </div>
          </div>

          {/* Bank Account Info */}
          <div className="space-y-6">
            <div className="bg-surface rounded-xl border border-border p-6">
              <h2 className="font-sans font-bold text-2xl text-text-heading mb-6">
                Transferencia Bancaria
              </h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-background rounded-lg border border-border">
                  <div className="font-medium text-text-heading mb-2">Banco Santander</div>
                  <div className="space-y-1 text-sm text-text-body">
                    <div><strong>Titular:</strong> Fundación Ser Galgos</div>
                    <div><strong>CUIT:</strong> 30-12345678-9</div>
                    <div><strong>CBU:</strong> 0720001120000001234567</div>
                    <div><strong>Alias:</strong> SERGALGOS.DONA</div>
                  </div>
                </div>

                <div className="p-4 bg-background rounded-lg border border-border">
                  <div className="font-medium text-text-heading mb-2">Banco Galicia</div>
                  <div className="space-y-1 text-sm text-text-body">
                    <div><strong>Titular:</strong> Fundación Ser Galgos</div>
                    <div><strong>CUIT:</strong> 30-12345678-9</div>
                    <div><strong>CBU:</strong> 0070001120000001234567</div>
                    <div><strong>Alias:</strong> GALGOS.AYUDA</div>
                  </div>
                </div>

                <div className="p-4 bg-background rounded-lg border border-border">
                  <div className="font-medium text-text-heading mb-2">Mercado Pago</div>
                  <div className="space-y-1 text-sm text-text-body">
                    <div><strong>CVU:</strong> 0000003100012345678901</div>
                    <div><strong>Alias:</strong> SERGALGOS.MP</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Impact Info */}
            <div className="bg-surface rounded-xl border border-border p-6">
              <h3 className="font-sans font-bold text-xl text-text-heading mb-4">
                Tu donación permite
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-text-body text-sm">Rescatar galgos en situación de abandono</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-text-body text-sm">Brindar atención veterinaria completa</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-text-body text-sm">Mantener nuestro refugio temporal</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-text-body text-sm">Facilitar el proceso de adopción</p>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Additional Info */}
        <div className="mt-12 bg-surface rounded-xl border border-border p-6">
          <h3 className="font-sans font-bold text-xl text-text-heading mb-4">
            ¿Necesitás comprobante fiscal?
          </h3>
          <p className="text-text-body mb-4">
            Como organización sin fines de lucro, podemos emitir un recibo de donación 
            para tu declaración de impuestos. Solo envianos tu comprobante de transferencia 
            por WhatsApp o email.
          </p>
          <div className="flex flex-wrap gap-3">
            <a 
              href="https://wa.me/5491123456789" 
              className="inline-flex items-center gap-2 text-green-600 hover:text-green-700"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.905 3.686z"/>
              </svg>
              WhatsApp: +54 9 11 2345-6789
            </a>
            <span className="text-text-muted">•</span>
            <a href="mailto:donaciones@sergalgos.org" className="text-primary hover:text-primary-hover">
              donaciones@sergalgos.org
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}