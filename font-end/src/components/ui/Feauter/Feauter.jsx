import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from "react-redux";
import axios from 'axios';
import API_URLS from '../../../config/config';
import ShoppingProductCard from '../ProductCard/product-card';
const FeaturedProducts = () => {
  const [shoes, setShoes] = useState([]);
  // const dispatch = useDispatch();

  useEffect(() => {
    axios.get(API_URLS.GET_PRODUCTS)
      .then(response => setShoes(response.data))
      .catch(error => console.error('Error fetching shoes:', error));
  }, []);

  // const handleProductClick = (productId) => {
  //   dispatch(fetchProductDetails(productId)).then(() => {
  //     navigate(`/shop/listing`);
  //   });
  // };


  return (
    <section className="bg-white py-16 px-6">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Featured Products</h2>
        
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {shoes.map((product) => (
            <div key={product.shoes_id} className="group relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="aspect-square overflow-hidden rounded-t-xl">
                <img
                  src={product.img}
                  alt={product.shoes_name}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900">{product.shoes_name}</h3>
                <p className="text-gray-600 mt-2">{product.price}</p>
                <Link to={`shoes/${product.shoes_id}`}>
                <button className="mt-4 w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-300">
                  Quick Add
                </button>
                </Link>
              </div>
            </div>
          ))}
        </div> */}

<div className="grid grid-cols-1 gap-4 px-4 mx-auto xl:container sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {shoes.length > 0 ? (
            shoes.map((product) => (
              <div
                key={product._id}
                className="rounded-md hover:shadow-2xl hover:cursor-pointer"
                onClick={() => handleProductClick(product._id)}
              >
                <ShoppingProductCard product={product} />
              </div>
            ))
          ) : (
            <div className="text-center text-muted-foreground">
              No products found
            </div>
          )}
        </div>

        <div className="mt-12 text-center">
          <a 
            href="/listing" 
            className="inline-block px-8 py-3 border-2 border-gray-900 text-gray-900 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300"
          >
            View All Products
          </a>
        </div>
      </div>
    </section>
  );
};

const HighlightedCollections = () => {
  const collections = [
    { id: 1, title: "Men's Gear", image: 'https://images.unsplash.com/photo-1556906781-2a4127b44769' },
    { id: 2, title: "Women's Gear", image: 'https://images.unsplash.com/photo-1556906781-2a4127b44769' },
    { id: 3, title: "Kids' Gear", image: 'https://images.unsplash.com/photo-1556906781-2a4127b44769' },
  ];

  return (
    <section className="bg-white py-16 px-6">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Explore Collections</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <div 
              key={collection.id} 
              className="relative group overflow-hidden rounded-xl aspect-square hover:shadow-xl transition-shadow duration-300"
            >
              <img
                src={collection.image}
                alt={collection.title}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <h3 className="text-2xl font-bold text-white">
                  {collection.title}
                </h3>
              </div>
              <a 
                href={`/${collection.title.toLowerCase().replace("'", '')}`} 
                className="absolute inset-0 z-10"
              />
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a 
            href="/collections" 
            className="inline-block px-8 py-3 border-2 border-gray-900 text-gray-900 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300"
          >
            Browse All Collections
          </a>
        </div>
      </div>
    </section>
  );
};

export { FeaturedProducts, HighlightedCollections };