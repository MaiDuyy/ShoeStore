import React from 'react';
import { 
  MapPin,
  Mail,
  Phone,
  Twitter,
  Facebook,
  Instagram
 } from "lucide-react";
 import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Nike Logo and Description */}
          <div className="space-y-4">
            <img
              src="https://www.logo.wine/a/logo/Nike%2C_Inc./Nike%2C_Inc.-Nike-Logo.wine.svg"
              alt="Nike Logo"
              className="h-8 w-auto"
            />
            <p className="text-gray-500 text-sm">
              Bringing inspiration and innovation to every athlete in the world.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-gray-900 font-semibold">Products</h3>
            <ul className="space-y-2">
              <li><Link to="/men" className="text-gray-600 hover:text-gray-900 text-sm">Men</Link></li>
              <li><Link to="/women" className="text-gray-600 hover:text-gray-900 text-sm">Women</Link></li>
              <li><Link to="/kids" className="text-gray-600 hover:text-gray-900 text-sm">Kids</Link></li>
              <li><Link to="/custom" className="text-gray-600 hover:text-gray-900 text-sm">Customize</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-gray-900 font-semibold">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/faq" className="text-gray-600 hover:text-gray-900 text-sm">FAQs</Link></li>
              <li><Link to="/shipping" className="text-gray-600 hover:text-gray-900 text-sm">Shipping</Link></li>
              <li><Link to="/returns" className="text-gray-600 hover:text-gray-900 text-sm">Returns</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-gray-900 text-sm">Contact Us</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-gray-900 font-semibold">Stay Updated</h3>
            <form className="flex flex-col space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-transparent"
              />
              <button
                type="submit"
                className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                Subscribe
              </button>
            </form>
            <p className="text-gray-500 text-xs">
              By subscribing, you agree to our Privacy Policy
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Copyright */}
          <div className="text-gray-600 text-sm">
            © {new Date().getFullYear()} Nike, Inc. All Rights Reserved
          </div>

          {/* Legal Links */}
          <div className="flex space-x-6">
            <Link to="/privacy" className="text-gray-600 hover:text-gray-900 text-sm">Privacy Policy</Link>
            <Link to="/terms" className="text-gray-600 hover:text-gray-900 text-sm">Terms of Service</Link>
            <Link to="/cookies" className="text-gray-600 hover:text-gray-900 text-sm">Cookies</Link>
          </div>

          {/* Social Media */}
          <div className="flex space-x-4">
            <Link to="/"><Twitter className="text-gray-400 hover:text-gray-900" /></Link>
            <Link to="/"><Facebook className="text-gray-400 hover:text-gray-900" /></Link>
            <Link to="/"><Instagram className="text-gray-400 hover:text-gray-900" /></Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;