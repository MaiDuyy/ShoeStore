import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ShoppingProductCard from '../ProductCard/product-card';
import { Loader } from 'lucide-react';
import { toast } from 'sonner';
import API_URLS from '../../../config/config';

const FeaturedProducts = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]); // [{ category, products, ... }]
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Tải “featured by category” (đã bao gồm products)
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch(API_URLS.GET_CATEGORIES); // endpoint của bạn trả đúng shape trên
        if (!res.ok) throw new Error('Failed to fetch featured categories');
        const data = await res.json();
        // Đảm bảo đúng kiểu mảng và có 'category' + 'products'
        const list = (Array.isArray(data) ? data : []).filter(
          x => x && typeof x.category === 'string' && Array.isArray(x.products)
        );
        setCategories(list);
      } catch (err) {
        setError(err.message);
        toast.error('Failed to fetch featured products: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  // Điều hướng chi tiết (nếu muốn bấm từ đây, Card của bạn đã tự navigate rồi)
  const handleProductClick = (product) => {
    const pid = product?.slug || product?._id || product?.sku;
    if (!pid) return;
    navigate(`/product/${pid}`);
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
          <div className="text-center py-12 text-red-500">{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-16 px-6">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Featured Products</h2>

        {categories.length > 0 ? (
          categories.map((cat) => (
            cat.products?.length ? (
              <div key={cat.category} className="mb-12">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-2xl font-semibold text-gray-900">
                    {cat.category}
                  </h3>
                  {/* Meta tùy chọn hiển thị */}
                  <div className="text-sm text-gray-500">
                    <span className="mr-4">Products: {cat.totalProducts ?? cat.products.length}</span>
                    {typeof cat.totalStock === 'number' && <span className="mr-4">Stock: {cat.totalStock}</span>}
                    {typeof cat.averagePrice === 'number' && <span>Avg: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(cat.averagePrice)}</span>}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <p className="text-gray-600">Top picks in “{cat.category}”</p>
                  <Link
                    to={`/listing?category=${encodeURIComponent(cat.category)}`}
                    className="text-sm font-medium text-gray-600 hover:text-gray-900"
                  >
                    View All →
                  </Link>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {cat.products.map((p) => (
                    <ShoppingProductCard
                      key={p._id || p.sku || p.slug}
                      product={p}  // đúng schema mới: name, price, imageURL, slug/_id, etc.
                      // handleGetProductDetails={() => handleProductClick(p)} // không bắt buộc
                    />
                  ))}
                </div>
              </div>
            ) : null
          ))
        ) : (
          <div className="text-center py-12 text-gray-500">No featured categories</div>
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

  // Tải danh sách category
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(API_URLS.GET_CATEGORIES);
        if (!res.ok) throw new Error('Failed to fetch categories');
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
        toast.error('Failed to fetch categories: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleCollectionClick = (category) => {
    const q = category.category_name || category.category_id;
    navigate(`/listing?category=${encodeURIComponent(q)}`);
  };

  if (loading) {
    return (
      <section className="bg-white py-16 px-6">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Explore Collections
          </h2>
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
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Explore Collections
          </h2>
          <div className="text-center py-12 text-red-500">{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-16 px-6">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Explore Collections
        </h2>

        {categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((c) => (
              <div
                key={c.category_id}
                className="relative group overflow-hidden rounded-xl aspect-square hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                onClick={() => handleCollectionClick(c)}
              >
                <img
                  src={
                    c.image_url ||
                    'https://images.unsplash.com/photo-1556906781-2a4127b44769'
                  }
                  alt={c.category_name}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                  <h3 className="text-2xl font-bold text-white">
                    {c.category_name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">No collections found</div>
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