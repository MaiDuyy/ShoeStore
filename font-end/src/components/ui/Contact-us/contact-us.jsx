import React from 'react';
import { 
   MapPin,
   Mail,
   Phone,
   Twitter,
   Facebook,
   Instagram
  } from "lucide-react";
import {Link} from "react-router-dom"
const ContactUs = () => {
  return (
    <section className="bg-white py-16 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Get in Touch</h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Have questions? Our team is here to help. Reach out to us for any inquiries or support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
            <form className="space-y-6">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="name">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="message">
                  Message
                </label>
                <textarea
                  id="message"
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Your message..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-300"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
              <Phone />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone</h3>
                <p className="text-gray-600">+84 (00) 123-4567</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
              <Mail />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
                <p className="text-gray-600">nhom4@nike.com</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
              <MapPin />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Headquarters</h3>
                <p className="text-gray-600">
                 14 Nguyễn Văn Bảo<br/>
                  Thành phố Hồ Chí Minh<br/>
                  VIệt Nam
                </p>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="pt-4 border-t border-gray-200 ">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Follow Us</h3>
              <div className="flex justify-items-center space-x-6 ">
               <Link to="/"> <Twitter className = "text-gray-400 hover:text-gray-900" /></Link>
              <Link to = "/">  <Facebook className = "text-gray-400 hover:text-gray-900" /></Link>
             <Link to = "/"><Instagram className = "text-gray-400 hover:text-gray-900" /></Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;