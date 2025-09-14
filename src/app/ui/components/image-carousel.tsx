'use client'

import { useState, useCallback, useEffect } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ImageCarouselProps {
  images: string[]
  alt: string
  className?: string
}

export function ImageCarousel({ images, alt, className = '' }: ImageCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false })
  const [selectedIndex, setSelectedIndex] = useState(0)

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index)
  }, [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (emblaApi) {
      emblaApi.on('select', onSelect)
      onSelect()
    }
  }, [emblaApi, onSelect])

  // Si solo hay una imagen, mostrarla sin carrusel
  if (images.length <= 1) {
    return (
      <div className={`aspect-square bg-gray-100 relative overflow-hidden ${className}`}>
        <img
          src={images[0]}
          alt={alt}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = `https://placehold.co/300x300/F3F4F6/9CA3AF?text=${encodeURIComponent(alt)}`
          }}
        />
      </div>
    )
  }

  return (
    <div className={`relative group ${className}`}>
      {/* Carrusel principal */}
      <div className="embla overflow-hidden rounded-lg" ref={emblaRef}>
        <div className="embla__container flex">
          {images.map((image, index) => (
            <div key={index} className="embla__slide flex-shrink-0 flex-grow-0 basis-full">
              <div className="aspect-square bg-gray-100 relative overflow-hidden">
                <img
                  src={image}
                  alt={`${alt} - imagen ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = `https://placehold.co/300x300/F3F4F6/9CA3AF?text=${encodeURIComponent(alt)}`
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Botones de navegación */}
      {images.length > 1 && (
        <>
          <button
            onClick={scrollPrev}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 shadow-lg transition-all duration-200 z-10 opacity-0 group-hover:opacity-100"
            aria-label="Imagen anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 shadow-lg transition-all duration-200 z-10 opacity-0 group-hover:opacity-100"
            aria-label="Siguiente imagen"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Indicadores de puntos */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 shadow-lg ${
                selectedIndex === index 
                  ? 'bg-white scale-110' 
                  : 'bg-white/60 hover:bg-white/80'
              }`}
              aria-label={`Ir a imagen ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}