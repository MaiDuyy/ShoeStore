import { 
  LogOut, 
  Menu, 
  ShoppingBag, 
  ShoppingCart, 
  Footprints, 
  UserCog ,
  User,
  Search 
} from "lucide-react";
import React from 'react';
import { Link } from "react-router-dom";
import { Button } from "../button";
import { Input } from "../input";
import { Label } from "../label";

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
  return (
    <header className="bg-white shadow-md">
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
          <a href="/men" className="text-gray-800 hover:text-gray-600 font-medium text-sm">
           Home
          </a>
          <a href="/women" className="text-gray-800 hover:text-gray-600 font-medium text-sm">
            Collection
          </a>
          <a href="/kids" className="text-gray-800 hover:text-gray-600 font-medium text-sm">
            Contact
          </a>
          <a href="/new-arrivals" className="text-gray-800 hover:text-gray-600 font-medium text-sm">
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
          <div className="hidden lg:flex items-center px-3 py-1.5 rounded-full border-2 border-gray-200 w-30 hover:bg-gray-100">
            <Search className="text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full outline-none bg-transparent text-gray-600 text-sm ml-2"
            />
          </div>

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