'use client'

import { useState } from 'react'
import { Product, useCart } from '../contexts/cart-context'
import { Plus } from 'lucide-react'
import { ColorSelector } from '../ui/components/color-selector'
import { ImageCarousel } from '../ui/components/image-carousel'

interface ShopClientProps {
  products: Product[]
}

export function ShopClient({ products }: ShopClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos')
  const [selectedColors, setSelectedColors] = useState<{[key: string]: string}>({})
  const { addItem } = useCart()

  const categories = ['todos', ...Array.from(new Set(products.map(p => p.category)))]
  const filteredProducts = selectedCategory === 'todos' 
    ? products 
    : products.filter(p => p.category === selectedCategory)

  return (
    <>
      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-primary text-text-on-primary'
                  : 'bg-surface text-text-heading border border-border hover:bg-primary-light'
              }`}
            >
              {category === 'todos' ? 'Todos' : category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-text-muted">No hay productos disponibles en esta categoría.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-surface rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow relative"
            >
              <ImageCarousel
                images={product.images && product.images.length > 0 ? product.images : [product.image]}
                alt={product.name}
                className=""
              />
              
              <div className="p-4 pb-16">
                <h3 className="font-sans font-medium text-text-heading text-lg leading-6 mb-2">
                  {product.name}
                </h3>
                
                <p className="text-text-muted text-sm leading-5 mb-3 line-clamp-2">
                  {product.description}
                </p>
                
                {/* Color Selection */}
                {product.colors && product.colors.length > 0 && (
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-text-heading mb-2">
                      Color:
                    </label>
                    <ColorSelector
                      options={product.colors.map(colorObj => ({ 
                        value: colorObj.name, 
                        label: colorObj.name,
                        color: colorObj.color
                      }))}
                      selectedValue={selectedColors[product.id]}
                      onChange={(value) => setSelectedColors(prev => ({ ...prev, [product.id]: value }))}
                      size="sm"
                    />
                  </div>
                )}
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-surface">
                <div className="flex items-center justify-between">
                  <span className="font-sans font-bold text-text-heading text-xl">
                    ${product.price.toLocaleString()}
                  </span>
                  
                  <button
                    onClick={() => addItem(product, selectedColors[product.id])}
                    className="inline-flex items-center justify-center bg-primary text-text-on-primary font-medium py-2 px-4 rounded-full hover:bg-primary-hover transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Agregar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}