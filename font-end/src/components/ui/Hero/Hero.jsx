import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="relative bg-white overflow-hidden">
      {/* Background Image with Gradient Overlay */}
      <div className="relative h-screen flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-white/50 z-10" />
        <img
          src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
          alt="Nike Shoes"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Content Container */}
        <div className="container mx-auto px-6 relative z-20">
          <div className="max-w-2xl lg:max-w-4xl">
            {/* Headline */}
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Unleash Your <span className="text-red-600">Potential</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg lg:text-xl text-gray-700 mb-8">
              Experience ultimate performance with Nike's latest collection. 
              Engineered for athletes who refuse to settle.
            </p>

            {/* CTA Buttons */}
            <div className="flex gap-4">
             
              <Link to={'/listing'} className="bg-black text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-800 transition-colors duration-300">Shop now</Link>
             
            </div>

          </div>
        </div>

        {/* Floating Product Image */}
        <div className="hidden lg:block absolute right-0 bottom-0 w-1/2 h-full">
          {/* <img
            src="https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/i1-5cc7de3b-2afc-49c2-a1e4-0508997d09e6/react-miler-mens-running-shoe-DgF6nr.jpg"
            alt="Nike Air Force 1"
            className="absolute bottom-0 right-0 h-5/6 object-contain animate-float"
          /> */}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;