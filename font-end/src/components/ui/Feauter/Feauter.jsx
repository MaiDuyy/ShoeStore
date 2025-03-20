import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ShoppingProductCard from '../ProductCard/product-card';
import { Loader } from 'lucide-react';
import { toast } from 'sonner';
import API_URLS from '../../../config/config';

const FeaturedProducts = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(API_URLS.GET_CATEGORIES);
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError(err.message);
        toast.error("Failed to fetch categories: " + err.message);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      if (!categories.length) return;

      try {
        const productsByCategory = {};
        for (const category of categories) {
          try {
            const response = await fetch(API_URLS.GET_TOP_PRODUCTS_BY_CATEGORY(category.category_id));
            if (response.status === 404) {
              // Bỏ qua các loại giày không có sản phẩm
              continue;
            }
            if (!response.ok) {
              throw new Error(`Failed to fetch products for category ${category.category_name}`);
            }
            const data = await response.json();
            if (data && data.length > 0) {
              productsByCategory[category.category_id] = data;
            }
          } catch (err) {
            console.error(`Error fetching products for category ${category.category_name}:`, err);
            // Bỏ qua lỗi và tiếp tục với category tiếp theo
            continue;
          }
        }
        setFeaturedProducts(productsByCategory);
      } catch (err) {
        setError(err.message);
        toast.error("Failed to fetch featured products: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, [categories]);

  const handleProductClick = (productId) => {
    navigate(`/shoes/${productId}`);
  };

  if (loading) {
    return (
      <section className="bg-white py-16 px-6">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Featured Products</h2>
          <div className="flex justify-center items-center py-12">
            <Loader className="w-8 h-8 animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-white py-16 px-6">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Featured Products</h2>
          <div className="text-center py-12 text-red-500">
            {error}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-16 px-6">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Featured Products</h2>

        {categories.length > 0 ? (
          categories.map((category) => (
            featuredProducts[category.category_id] && (
              <div key={category.category_id} className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-semibold text-gray-900">{category.category_name}</h3>
                  <Link
                    to={`/listing?category=${category.category_id}`}
                    className="text-sm font-medium text-gray-600 hover:text-gray-900"
                  >
                    View All →
                  </Link>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {featuredProducts[category.category_id].map((product) => (
                    <ShoppingProductCard
                      key={product.shoes_id}
                      product={{
                        ...product,
                        price: product.sale_price || product.original_price,
                        image: product.images?.[0] || 'https://images.unsplash.com/photo-1556906781-2a4127b44769'
                      }}
                      handleGetProductDetails={handleProductClick}
                    />
                  ))}
                </div>
              </div>
            )
          ))
        ) : (
          <div className="text-center py-12 text-gray-500">
            No categories found
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            to="/listing"
            className="inline-block px-8 py-3 border-2 border-gray-900 text-gray-900 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
};

const HighlightedCollections = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(API_URLS.GET_CATEGORIES);
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError(err.message);
        toast.error("Failed to fetch categories: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCollectionClick = (categoryId) => {
    navigate(`/listing?category=${categoryId}`);
  };

  if (loading) {
    return (
      <section className="bg-white py-16 px-6">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Explore Collections</h2>
          <div className="flex justify-center items-center py-12">
            <Loader className="w-8 h-8 animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-white py-16 px-6">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Explore Collections</h2>
          <div className="text-center py-12 text-red-500">
            {error}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-16 px-6">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Explore Collections</h2>

        {categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div
                key={category.category_id}
                className="relative group overflow-hidden rounded-xl aspect-square hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                onClick={() => handleCollectionClick(category.category_id)}
              >
                <img
                  src={category.image_url || 'https://images.unsplash.com/photo-1556906781-2a4127b44769'}
                  alt={category.category_name}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                  <h3 className="text-2xl font-bold text-white">
                    {category.category_name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            No collections found
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            to="/collections"
            className="inline-block px-8 py-3 border-2 border-gray-900 text-gray-900 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300"
          >
            Browse All Collections
          </Link>
        </div>
      </div>
    </section>
  );
};

export { FeaturedProducts, HighlightedCollections };