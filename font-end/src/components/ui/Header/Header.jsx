// Header.jsx
import React, { useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { 
  LogOut, 
  Menu, 
  ShoppingBag, 
  ShoppingCart, 
  UserCog,
  User,
  Plus,
  Minus,
  Trash2
} from "lucide-react";

import { Button } from "../button";
import { useCart } from "@/contexts/CartContext";
import SearchBar from '@/components/ui/SearchBar/SearchBar';

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

import { useAuth } from "@/contexts/AuthContext";

/** Utils */
const getInitials = (nameOrEmail = '') => {
  const s = String(nameOrEmail).trim();
  if (!s) return 'U';
  const parts = s.includes(' ') ? s.split(' ') : [s];
  const first = parts[0]?.[0] || 'U';
  const second = parts[1]?.[0] || '';
  return (first + second).toUpperCase();
};

const currency = (n) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(n || 0));

/** Quy ước vai trò có trang quản trị (theo Corbado demo: ROLE_ADMIN) */
const isAdminLike = (roles = []) => {
  const set = new Set((roles || []).map(r => String(r).toUpperCase()));
  return set.has('ROLE_ADMIN') || set.has('ROLE_SUPERADMIN') || set.has('ADMIN') || set.has('SUPERADMIN');
};

/** ==================== HeaderRightContent ==================== */
const HeaderRightContent = ({ user, onLogout }) => {
  const navigate = useNavigate();

  if (!user) {
    // Chưa đăng nhập: Hiện Login / Register
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" onClick={() => navigate('/auth/login')}>Login</Button>
        <Button onClick={() => navigate('/auth/register')}>Register</Button>
      </div>
    );
  }

  const label = user?.username || user?.name || user?.email || 'User';
  const roles = Array.isArray(user?.roles) ? user.roles : (user?.roles ? [user.roles] : []);
  const rolesText = roles.join(', ');

  return (
    <div className="flex items-center gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="bg-black cursor-pointer">
            <AvatarFallback className="font-extrabold text-white bg-black">
              {getInitials(label)}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent side="right" className="w-56">
          <DropdownMenuLabel className="space-y-1">
            <div className="text-sm text-gray-500">Logged in as</div>
            <div className="font-medium">{label}</div>
            {rolesText && <div className="text-xs text-gray-500">Roles: {rolesText}</div>}
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => navigate('/account')}>
            <UserCog className="w-4 h-4 mr-2" /> Account
          </DropdownMenuItem>

          {isAdminLike(roles) && (
            <DropdownMenuItem onClick={() => navigate('/admin')}>
              <User className="w-4 h-4 mr-2" /> Admin Dashboard
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onLogout}>
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

/** ==================== Cart ==================== */
const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, totalPrice } = useCart();

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
                      src={item.imageURL} 
                      alt={item.name}
                      className="h-20 w-20 rounded-md object-cover"
                    />
                    <div className="flex flex-1 flex-col gap-1">
                      <h3 className="font-medium line-clamp-2">{item.name}</h3>
                      <p className="text-sm text-gray-500">{currency(item.price)}</p>
                      
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
            <p>{currency(totalPrice)}</p>
          </div>
          <SheetFooter className="mt-6">
            <SheetClose asChild>
              <Button className="w-full" disabled={cartItems.length === 0}>
                Checkout ({currency(totalPrice)})
              </Button>
            </SheetClose>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
};

/** ==================== Header ==================== */
const Header = () => {
  const navigate = useNavigate();
  const { user, logout, refreshMe } = useAuth();

  // F5/first load: xác thực token qua /api/test/user (theo bài Corbado)
  useEffect(() => {
    if (!user && typeof refreshMe === 'function') {
      refreshMe().catch(() => {/* ignore */});
    }
  }, [user, refreshMe]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-6 py-4 grid grid-cols-3 items-center gap-4">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold text-gray-800">
            <img
              src="https://www.logo.wine/a/logo/Nike%2C_Inc./Nike%2C_Inc.-Nike-Logo.wine.svg"
              alt="Logo"
              className="h-10"
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex justify-center items-center space-x-6">
          <Link to={"/"} className="text-gray-800 hover:text-gray-600 font-medium text-sm">
            Home
          </Link>
          <Link to={"/listing"} className="text-gray-800 hover:text-gray-600 font-medium text-sm">
            Collection
          </Link>
          <Link to={"/contact"} className="text-gray-800 hover:text-gray-600 font-medium text-sm">
            Contact
          </Link>
          <Link to={"/about"} className="text-gray-800 hover:text-gray-600 font-medium text-sm">
            About Us
          </Link>
          {user && isAdminLike(user.roles) && (
            <Link to={"/admin"} className="text-gray-800 hover:text-gray-600 font-medium text-sm">
              Admin
            </Link>
          )}
        </nav>

        {/* Right Section */}
        <div className="flex items-center justify-end gap-4">
          {/* Mobile Menu (Sheet) */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-xs">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription>Quick navigation</SheetDescription>
              </SheetHeader>

              <div className="mt-4 flex flex-col gap-3">
                <Link to={"/"} className="text-gray-800 hover:text-gray-600 font-medium text-sm">
                  Home
                </Link>
                <Link to={"/listing"} className="text-gray-800 hover:text-gray-600 font-medium text-sm">
                  Collection
                </Link>
                <Link to={"/contact"} className="text-gray-800 hover:text-gray-600 font-medium text-sm">
                  Contact
                </Link>
                <Link to={"/about"} className="text-gray-800 hover:text-gray-600 font-medium text-sm">
                  About Us
                </Link>
                {user && isAdminLike(user.roles) && (
                  <Link to={"/admin"} className="text-gray-800 hover:text-gray-600 font-medium text-sm">
                    Admin
                  </Link>
                )}
              </div>

              <div className="mt-6">
                <HeaderRightContent user={user} onLogout={handleLogout} />
              </div>
            </SheetContent>
          </Sheet>

          {/* Search */}
          <SearchBar className="hidden md:flex justify-center" />

          {/* Cart + User */}
          <div className="flex items-center gap-4">
            <Cart />
            <div className="hidden lg:block">
              <HeaderRightContent user={user} onLogout={handleLogout} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
