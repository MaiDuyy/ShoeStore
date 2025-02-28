import React from 'react';

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
              <a 
                href="/shop" 
                className="bg-black text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-800 transition-colors duration-300"
              >
                Shop Now
              </a>
              <a 
                href="/collections" 
                className="border-2 border-gray-900 text-gray-900 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors duration-300"
              >
                Explore Collections
              </a>
            </div>

            {/* Nike Logo Watermark */}
            {/* <svg 
              className="mt-12 w-24 opacity-20" 
              viewBox="0 0 80 29"
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M9.733 28.25H0L13.082 0h9.733L9.733 28.25zm16.641-14.23c-2.45-2.058-4.09-4.406-4.09-7.832 0-3.51 1.64-6.19 5.08-6.19 3.27 0 5 2.68 5 6.19 0 3.425-1.64 5.774-4.09 7.832h-1.9zm9.644 14.23h-9.55l6.37-21.5c1.81-5.69 4.91-6.75 8.52-6.75v9.5c-2.25 0-3.73.85-4.72 4.06l-1.62 5.69 12.1 9.5H45.5l-8.52-6.75 4.72-9.5c1.73-3.51 3.35-4.15 5.85-4.15v-9.5c-4.72 0-9.18 2.47-11.41 7.66l-6.45 21.5h-9.55l9.55-28.25h9.55l-3.36 10.83c1.89-2.68 4.63-4.32 8.18-4.32 5.25 0 8.78 3.77 8.78 9.18 0 5.5-3.53 9.18-8.78 9.18-2.68 0-5.08-1.13-6.7-3.18l-1.38 4.32L36.018 28.25zm34.242 0h-9.73l13.08-28.25h9.74L70.26 28.25z" 
                fill="currentColor"
              />
            </svg> */}
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