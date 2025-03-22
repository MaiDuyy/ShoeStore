import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';

const CartContext = createContext();

const CART_STORAGE_KEY = 'shopping_cart';

export const CartProvider = ({ children }) => {
  // Khởi tạo state từ localStorage nếu có, không thì dùng mảng rỗng
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Lưu cartItems vào localStorage mỗi khi nó thay đổi
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  // thêm vào giỏ hàng
  const addToCart = (item) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === item.id);
      if (existingItem) {
        return prevItems.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevItems, { ...item, quantity: 1 }];
    });
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const removeAll = () => {
    setCartItems([]);
    localStorage.removeItem(CART_STORAGE_KEY); // Xóa cả trong localStorage
  };

  // Cập nhật số lượng sản phẩm 
  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  // Tìm kiếm sản phẩm
  const searchItems = (query) => {
    setSearchQuery(query);
  };

  // Tính giá sử dụng useMemo
  const totalPrice = useMemo(() => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cartItems]);

  // lọc sản phẩm dựa trên từ khóa tìm kiếm
  const filteredItems = useMemo(() => {
    if (!searchQuery) return cartItems;
    return cartItems.filter(item =>
      item.shoes_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [cartItems, searchQuery]);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      searchItems,
      removeAll,
      searchQuery,
      totalPrice,
      filteredItems
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 