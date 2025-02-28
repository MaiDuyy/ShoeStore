import { 
  LogOut, 
  Menu, 
  ShoppingBag, 
  ShoppingCart, 
  Footprints, 
  UserCog ,
  User
} from "lucide-react";
import React, { useContext, useState } from 'react';
import { Link, useNavigate} from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

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
import { AuthContext } from "../../config/AuthContext";

const HeaderRightContent = () => {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext) // Lấy isLoggedIn và setIsLoggedIn từ context

  return (
    <div className="flex items-center gap-4">
      {isLoggedIn ? (
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
            <DropdownMenuItem onClick={() => setIsLoggedIn(false)}>
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/auth/login">Sign In</Link>
          </Button>
          <Button asChild>
            <Link to="/auth/register">Sign Up</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

const Cart = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <ShoppingCart className="w-6 h-6 hidden text-gray-800 hover:text-gray-600 lg:block"/>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value="Pedro Duarte" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input id="username" value="@peduarte" className="col-span-3" />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Nike Logo */}
        <div className="flex items-center">
          <a href="/" className="text-2xl font-bold text-gray-800">
            <img
              src="https://www.logo.wine/a/logo/Nike%2C_Inc./Nike%2C_Inc.-Nike-Logo.wine.svg"
              alt="Nike Logo"
              className="h-10"
            />
          </a>
        </div>

        {/* Navigation Menu */}
        <nav className="hidden md:flex space-x-8">
          <a href="/men" className="text-gray-800 hover:text-gray-600 font-medium">
            Men
          </a>
          <a href="/women" className="text-gray-800 hover:text-gray-600 font-medium">
            Women
          </a>
          <a href="/kids" className="text-gray-800 hover:text-gray-600 font-medium">
            Kids
          </a>
          <a href="/new-arrivals" className="text-gray-800 hover:text-gray-600 font-medium">
            New Arrivals
          </a>
          <a href="/sale" className="text-gray-800 hover:text-gray-600 font-medium">
            Sale
          </a>
        </nav>

        <div className="flex items-center gap-4">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-xs">
              <HeaderRightContent isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            </SheetContent>
          </Sheet>

        
          <Cart/>
         
        
          <div className="hidden lg:block">
            <HeaderRightContent isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;