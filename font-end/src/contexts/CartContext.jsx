// src/contexts/CartContext/index.jsx
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

  /** Thêm vào giỏ:
   * Gộp theo: id + selectedSize?.name + selectedColor?.name
   */
  const addToCart = (item) => {
    setCartItems(prev => {
      const keyMatch = (a, b) =>
        a.id === b.id &&
        (a.selectedSize?.name || null) === (b.selectedSize?.name || null) &&
        (a.selectedColor?.name || null) === (b.selectedColor?.name || null);

      const existing = prev.find(i => keyMatch(i, item));
      if (existing) {
        return prev.map(i =>
          keyMatch(i, item) ? { ...i, quantity: (i.quantity || 0) + (item.quantity || 1) } : i
        );
      }
      return [...prev, { ...item, quantity: item.quantity || 1 }];
    });
  };

  // Xóa sản phẩm khỏi giỏ hàng (theo id + biến thể nếu có)
  const removeFromCart = (itemId, selectedSizeName = null, selectedColorName = null) => {
    setCartItems(prev =>
      prev.filter(i =>
        !(i.id === itemId &&
          (i.selectedSize?.name || null) === (selectedSizeName || null) &&
          (i.selectedColor?.name || null) === (selectedColorName || null))
      )
    );
  };

  const removeAll = () => {
    setCartItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  // Cập nhật số lượng theo id + biến thể
  const updateQuantity = (itemId, quantity, selectedSizeName = null, selectedColorName = null) => {
    if (quantity <= 0) {
      removeFromCart(itemId, selectedSizeName, selectedColorName);
      return;
    }
    setCartItems(prev =>
      prev.map(i =>
        (i.id === itemId &&
          (i.selectedSize?.name || null) === (selectedSizeName || null) &&
          (i.selectedColor?.name || null) === (selectedColorName || null))
          ? { ...i, quantity }
          : i
      )
    );
  };

  // Tìm kiếm sản phẩm
  const searchItems = (query) => setSearchQuery(query);

  // Tổng tiền
  const totalPrice = useMemo(
    () => cartItems.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0),
    [cartItems]
  );

  // Lọc sản phẩm dựa trên từ khóa tìm kiếm (dùng name thay vì shoes_name)
  const filteredItems = useMemo(() => {
    if (!searchQuery) return cartItems;
    const q = searchQuery.toLowerCase();
    return cartItems.filter(item => String(item.name || '').toLowerCase().includes(q));
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
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
};
