import { 
  LogOut, 
  Menu, 
  ShoppingBag, 
  ShoppingCart, 
  Footprints, 
  UserCog ,
  User,
  Search,
  Plus,
  Minus,
  Trash2
} from "lucide-react";
import React from 'react';
import { Link } from "react-router-dom";
import { Button } from "../button";
import { Input } from "../input";
import { Label } from "../label";
import { useCart } from "@/contexts/CartContext";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import SearchBar from '@/components/ui/SearchBar/SearchBar';

const HeaderRightContent = () => {
  return (
    <div className="flex items-center gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="bg-black">
            <AvatarFallback className="font-extrabold text-white bg-black">
              U
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" className="w-56">
          <DropdownMenuLabel>
            Logged In as <span className="font-medium">User</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <UserCog className="w-4 h-4 mr-2" /> Account
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
const Cart = () => {
  const { cartItems, addToCart, removeFromCart, updateQuantity, totalPrice } = useCart();
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="relative">
          <ShoppingCart className="w-6 h-6 hidden text-gray-800 hover:text-gray-600 lg:block"/>
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {cartItems.length}
            </span>
          )}
        </div>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader className="px-1">
          <SheetTitle>Shopping Cart</SheetTitle>
          <SheetDescription>
            {cartItems.length === 0 ? 'Your cart is empty' : `You have ${cartItems.length} items in your cart`}
          </SheetDescription>
        </SheetHeader>
        
        <div className="flex flex-1 flex-col gap-5 overflow-hidden">
          {cartItems.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center">
              <ShoppingBag className="mb-4 h-16 w-16 text-gray-400" />
              <p className="text-gray-500">No items in cart</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              <div className="h-full space-y-4 overflow-y-auto p-1">
                {cartItems.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex items-start gap-4 rounded-lg border bg-white p-4 shadow-sm"
                  >
                    <img 
                      src={item.images} 
                      alt={item.shoes_name}
                      className="h-20 w-20 rounded-md object-cover"
                    />
                    <div className="flex flex-1 flex-col gap-1">
                      <h3 className="font-medium line-clamp-2">{item.shoes_name}</h3>
                      <p className="text-sm text-gray-500">${item.price}</p>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => removeFromCart(item.id)}
                          className="ml-auto"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="border-t pt-4 mt-auto">
          <div className="flex justify-between text-base font-medium px-1">
            <p>Subtotal</p>
            <p>${totalPrice.toFixed(2)}</p>
          </div>
          <SheetFooter className="mt-6">
            <SheetClose asChild>
              <Button className="w-full" disabled={cartItems.length === 0}>
                Checkout (${totalPrice.toFixed(2)})
              </Button>
            </SheetClose>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
};
const Header = () => {
  return (
    <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-6 py-4 grid grid-cols-3 items-center gap-4">
        {/* Nike Logo - Cột trái */}
        <div className="flex items-center">
          <a href="/" className="text-2xl font-bold text-gray-800">
            <img
              src="https://www.logo.wine/a/logo/Nike%2C_Inc./Nike%2C_Inc.-Nike-Logo.wine.svg"
              alt="Nike Logo"
              className="h-10"
            />
          </a>
        </div>

        {/* Navigation Menu - Cột giữa */}
        <nav className="hidden md:flex justify-center items-center space-x-6">
          <a href="/" className="text-gray-800 hover:text-gray-600 font-medium text-sm">
           Home
          </a>
          <a href="/listing" className="text-gray-800 hover:text-gray-600 font-medium text-sm">
            Collection
          </a>
          <a href="/contact" className="text-gray-800 hover:text-gray-600 font-medium text-sm">
            Contact
          </a>
          <a href="/about" className="text-gray-800 hover:text-gray-600 font-medium text-sm">
            About Us
          </a>
        </nav>

        {/* Right Section - Cột phải */}
        <div className="flex items-center justify-end gap-4">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-xs">
              <HeaderRightContent />
            </SheetContent>
          </Sheet>

          {/* Search Bar */}
          {/* <div className="hidden lg:flex items-center px-3 py-1.5 rounded-full border-2 border-gray-200 w-30 hover:bg-gray-100"> */}
            <SearchBar className="flex justify-center" />
            {/* <input
              type="text"
              placeholder="Search..."
              className="w-full outline-none bg-transparent text-gray-600 text-sm ml-2"
            /> */}
          {/* </div> */}

          {/* Cart and User Section */}
          <div className="flex items-center gap-4">
            <Cart />
            <div className="hidden lg:block">
              <HeaderRightContent />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;