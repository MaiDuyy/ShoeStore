import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import ShoppingHeader from "../../components/ui/Header/Header";

import Footer from "../../components/ui/Footer/Footer";
import { MoveRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { fetchFilteredProducts } from "@/store/shopSlice";

import banner1 from "@/assets/banner1.png";
import banner2 from "@/assets/banner2.png";
import HeroSection from "../../components/ui/Hero/Hero";
import { FeaturedProducts, HighlightedCollections } from "../../components/ui/Feauter/Feauter";
import ContactUs from "../../components/ui/Contact-us/contact-us";

// import banner3 from "@/assets/banner3.png"; // Thêm banner3 để tránh lỗi

const Home = () => {
  const banners = [banner1, banner2];
  const [currentBanner, setCurrentBanner] = useState(0);
  // const { products } = useSelector((state) => state.shopProducts);
  // const dispatch = useDispatch();
  // const navigate = useNavigate();

  // useEffect(() => {
  //   dispatch(
  //     fetchFilteredProducts({
  //       filtersParams: {},
  //       sortParams: "",
  //       page: 1,
  //       limit: 12,
  //     })
  //   );
  // }, [dispatch]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length]);

  return (
    <>
      <ShoppingHeader />
      <Fragment>
        <section id="hero" className="w-full mt-12">
          {/* <div className="relative z-10 w-full h-[70vh] bg-green"> */}
            {/* Content */}
            {/* <div className="container relative z-10 flex items-center w-full h-full px-4 mx-auto xl:px-12">
              <div>
                <div className="flex flex-col mb-8 gap-y-2">
                  <h1 className="text-4xl font-semibold">
                    We Picked The Best Item For You.
                  </h1>
                  <h1 className="text-4xl font-bold text-white">
                    You Must Love It.
                  </h1>
                </div>
                <Button onClick={() => navigate("/shop/listing")}>
                  See Collections
                  <MoveRightIcon className="w-6 h-6 ml-2" />
                </Button>
              </div>
            </div> */}

            {/* Banner */}
            {/* <div className="absolute top-0 left-0 z-0 flex items-center w-full h-full overflow-hidden">
              {banners.map((banner, index) => (
                <img
                  key={index}
                  src={banner}
                  alt="banner"
                  className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
                    index === currentBanner ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}
            </div>
          </div> */}


          <HeroSection/>
          <FeaturedProducts/>
          <HighlightedCollections/>
          
          <ContactUs/>
        </section>

        <Footer/>
      </Fragment>
    </>
  );
};

export default Home;
