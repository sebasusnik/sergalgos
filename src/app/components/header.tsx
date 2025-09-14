import Link from 'next/link'
import Cart from './cart'

export default function Header() {

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="font-allura text-4xl">
            <Link href="/">
              <span className="text-text-heading">Ser</span>
              <span className="text-primary">Galgos</span>
            </Link>
          </div>

          {/* Nav & Donate Button Container */}
          <div className="flex items-center gap-4 md:gap-6">
            {/* Desktop Navigation */}
            <nav id="nav-desktop" className="hidden md:flex items-center gap-6">
              <Link href="/">
                Inicio
              </Link>
              <Link href="/adoptar">
                Adoptar
              </Link>
              <Link href="/tienda">
                Tienda
              </Link>
            </nav>

            {/* Cart */}
            <Cart />

            {/* Donate Button */}
            <Link
              href="/donar"
              className="inline-flex items-center justify-center bg-primary text-text-on-primary font-bold py-2 px-4 rounded-full hover:bg-primary-hover transition-colors cursor-pointer text-sm"
            >
              Donar
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
