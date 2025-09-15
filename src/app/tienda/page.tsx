import Container from '../components/container'
import { ShopClient } from './shop-client'
import { Product } from '../contexts/cart-context'
import { GET } from '../api/products/route'

async function fetchProducts(): Promise<Product[]> {
  try {
    // Call the API route directly instead of making HTTP request
    const response = await GET()
    const data = await response.json()
    return data.products || []
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export default async function Shop() {
  const products = await fetchProducts()

  return (
    <div className="bg-background font-sans pb-20 md:pb-0">
      <Container className="py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif font-semibold text-4xl text-text-heading mb-2">
              Tienda
            </h1>
            <p className="text-text-muted">
              Productos especiales para el cuidado de tu galgo
            </p>
          </div>
        </div>

        <ShopClient products={products} />

        {/* Info Section */}
        <section className="mt-12 p-6 bg-surface rounded-xl border border-primary">
          <h2 className="font-sans font-bold text-text-heading text-xl leading-6 mb-4">
            Apoyá nuestra misión
          </h2>
          <p className="text-text-muted leading-6">
            Cada compra en nuestra tienda ayuda directamente a rescatar y cuidar más galgos. 
            Todos los productos están seleccionados especialmente para las necesidades únicas de estos hermosos perros.
          </p>
        </section>
      </Container>
    </div>
  )
}