import React, { useEffect, useState } from 'react'
import axios from 'axios'
import API_URLS from '@/config/config'

import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import ShoppingProductCard from '../ProductCard/product-card'

export const shoppingProductFilterOptions = {
    category: [
      { id: 'LG1', label: 'Running' },
      { id: 'LG2', label: 'Basketball' },
      { id: 'LG3', label: 'Training' },
    
    ],
    brand: [
      { id: 'BR1', label: 'Nike' },
      { id: 'BR2', label: 'Adidas' },
     
    ]
  }
const ShowAllProductsPage = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState({
    category: 'all',
    sort: 'newest',
  })

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(API_URLS.GET_PRODUCTS)
        setProducts(response.data)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.shoes_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
      
      const matchesCategory = filter.category === 'all' 
        || product.category_id === filter.category

      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      if (filter.sort === 'price-low-high') return a.price - b.price
      if (filter.sort === 'price-high-low') return b.price - a.price
      return new Date(b.createdAt) - new Date(a.createdAt)
    })

  if (loading) {
    return (
      <div className="container grid grid-cols-1 gap-6 py-8 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, index) => (
          <Skeleton key={index} className="h-[400px] w-full rounded-lg" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-8 text-center text-red-500">
        Error loading products: {error}
      </div>
    )
  }

  return (
    <div className="container py-8">
      <h1 className="mb-8 text-3xl font-bold text-center">All Running Shoes</h1>
      
      {/* Filters Section */}
      <div className="flex flex-col gap-4 mb-8 md:flex-row">
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="md:max-w-xs"
        />
        
        <Select
          value={filter.category}
          onValueChange={(value) => setFilter({ ...filter, category: value })}
        >
          <SelectTrigger className="md:max-w-xs">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {shoppingProductFilterOptions.category.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filter.sort}
          onValueChange={(value) => setFilter({ ...filter, sort: value })}
        >
          <SelectTrigger className="md:max-w-xs">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest Arrivals</SelectItem>
            <SelectItem value="price-low-high">Price: Low to High</SelectItem>
            <SelectItem value="price-high-low">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center text-gray-500">
          No products found matching your criteria
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <ShoppingProductCard
              key={product.shoes_id}
              product={product}
              handleGetProductDetails={(id) => {
                // Handle navigation to product detail page
                console.log('Navigate to product:', id)
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default ShowAllProductsPage