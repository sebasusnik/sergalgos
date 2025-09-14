import Link from 'next/link'
import { Store, Home, Heart, Phone } from 'lucide-react'

export default function MobileNav() {

  return (
    <nav id="nav-mobile" className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border md:hidden">
      <div className="flex items-start gap-2 p-3 w-full max-w-5xl mx-auto">
        <Link href="/" className="flex flex-col items-center justify-center gap-1 flex-1 p-2 rounded-lg transition-colors hover:bg-primary-light">
          <div className="flex items-center justify-center h-6">
            <Home className="w-6 h-6 text-text-body" />
          </div>
          <span className="font-sans font-medium text-xs leading-[18px] text-center">Inicio</span>
        </Link>
        <Link href="/adoptar" className="flex flex-col items-center justify-center gap-1 flex-1 p-2 rounded-lg transition-colors hover:bg-primary-light">
          <div className="flex items-center justify-center h-6">
            <Heart className="w-6 h-6 text-text-body" />
          </div>
          <span className="font-sans font-medium text-xs leading-[18px] text-center text-gray-500">Adoptar</span>
        </Link>
        <Link href="/tienda" className="flex flex-col items-center justify-center gap-1 flex-1 p-2 rounded-lg transition-colors hover:bg-primary-light">
          <div className="flex items-center justify-center h-6">
            <Store className="w-6 h-6 text-text-body" />
          </div>
          <span className="font-sans font-medium text-xs leading-[18px] text-center text-gray-500">Tienda</span>
        </Link>
        <Link href="#contacto" className="flex flex-col items-center justify-center gap-1 flex-1 p-2 rounded-lg transition-colors hover:bg-primary-light">
          <div className="flex items-center justify-center h-6">
            <Phone className="w-6 h-6 text-text-body" />
          </div>
          <span className="font-sans font-medium text-xs leading-[18px] text-center text-gray-500">Contacto</span>
        </Link>
      </div>
    </nav>
  )
}
