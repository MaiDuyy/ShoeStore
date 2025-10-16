import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from "@/contexts/CartContext";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";

const formatCurrency = (value, locale = 'vi-VN', currency = 'VND') =>
  new Intl.NumberFormat(locale, { style: 'currency', currency }).format(Number(value || 0));

const ProductDetail = () => {
  const { id } = useParams(); // id có thể là _id hoặc slug
  const [product, setProduct] = useState(null);

  const [selectedSize, setSelectedSize] = useState(null);   // { name: 'A5' }
  const [selectedColor, setSelectedColor] = useState(null); // { name: 'red' }
  const [currentImage, setCurrentImage] = useState('');

  const { addToCart, cartItems } = useCart();

  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: "",
    description: "",
    variant: "default"
  });

  // Auto-close alert nhanh
  useEffect(() => {
    let timeoutId;
    if (showAlert) {
      timeoutId = setTimeout(() => setShowAlert(false), 400);
    }
    return () => timeoutId && clearTimeout(timeoutId);
  }, [showAlert]);

  // Fetch product theo id/slug
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // API của bạn có thể nhận _id hoặc slug. Giữ nguyên đường dẫn cũ:
        const res = await axios.get(`http://localhost:5000/products/${id}`);
        const p = res.data;

        setProduct(p);
        setCurrentImage(p.imageURL);

        // chọn mặc định size/color đầu tiên nếu có
        const sizes = p?.attributes?.sizes || [];
        const colors = p?.attributes?.colors || [];
        setSelectedSize(sizes.length ? { name: sizes[0] } : null);
        setSelectedColor(colors.length ? { name: colors[0] } : null);
      } catch (err) {
        console.error('Error fetching product:', err);
      }
    };
    fetchProduct();
  }, [id]);

  const productId = useMemo(() => {
    if (!product) return null;
    return product?._id || product?.sku || product?.slug;
  }, [product]);

  const totalStock = Number(product?.items_left || 0);
  const inInventory = !!product?.is_in_inventory;

  const showAlertDialog = (title, description, variant = "default") => {
    setAlertConfig({ title, description, variant });
    setShowAlert(true);
  };

  // Đếm đã có trong giỏ cho đúng SP + (nếu có) đúng lựa chọn size/color
  const currentCartQty = useMemo(() => {
    if (!productId || !Array.isArray(cartItems)) return 0;
    return cartItems.reduce((sum, item) => {
      const sameProduct = item?.id === productId;
      const sameSize = selectedSize?.name ? item?.selectedSize?.name === selectedSize.name : true;
      const sameColor = selectedColor?.name ? item?.selectedColor?.name === selectedColor.name : true;
      return sameProduct && sameSize && sameColor ? sum + (item?.quantity || 0) : sum;
    }, 0);
  }, [cartItems, productId, selectedSize, selectedColor]);

  const availableQty = Math.max(totalStock - currentCartQty, 0);
  const inStock = inInventory && totalStock > 0;
  const isMaxQuantityReached = availableQty <= 0;

  const handleSizeSelect = (sizeName) => setSelectedSize({ name: sizeName });
  const handleColorSelect = (colorName) => setSelectedColor({ name: colorName });

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      showAlertDialog("Không thể thêm", "Vui lòng chọn cả size và màu", "error");
      return;
    }
    if (!inStock) {
      showAlertDialog("Không thể thêm", "Sản phẩm hiện hết hàng hoặc không có trong kho", "error");
      return;
    }
    if (isMaxQuantityReached) {
      showAlertDialog("Không thể thêm", "Bạn đã đạt số lượng tối đa hiện có cho lựa chọn này", "error");
      return;
    }

    addToCart({
      id: productId,
      name: product?.name,
      price: Number(product?.price || 0),
      imageURL: product?.imageURL,
      quantity: 1,
      selectedColor: selectedColor ? { name: selectedColor.name } : null,
      selectedSize: selectedSize ? { name: selectedSize.name } : null,
      availableQuantity: totalStock, // tổng tồn kho
    });

    const parts = [];
    if (selectedSize?.name) parts.push(`size ${selectedSize.name}`);
    if (selectedColor?.name) parts.push(`màu ${selectedColor.name}`);
    showAlertDialog("Thành công", `Đã thêm${parts.length ? ` ${parts.join(', ')}` : ''} vào giỏ hàng!`, "success");
  };

  if (!product) return <div className="text-center mt-10">Loading...</div>;

  const sizes = product?.attributes?.sizes || [];
  const colors = product?.attributes?.colors || [];
  const features = product?.attributes?.features || [];

  // Nếu color không phải CSS color hợp lệ, giữ nút text
  const swatchStyle = (c) => {
    // màu hợp lệ đơn giản: tên màu phổ biến hoặc mã hex
    const isHex = /^#([0-9A-F]{3}){1,2}$/i.test(c);
    const isWord = /^[a-zA-Z]+$/.test(c);
    return isHex || isWord ? { backgroundColor: c } : {};
  };

  return (
    <>
      <div className="bg-white min-h-screen">
        <div className="container mx-auto px-6 py-12">
          {/* Stock Status */}
          <div className={`mb-4 text-sm font-medium ${
            selectedColor && selectedSize
              ? inStock
                ? (isMaxQuantityReached ? 'text-red-600' : 'text-green-600')
                : 'text-red-600'
              : 'text-gray-600'
          }`}>
            {selectedColor && selectedSize
              ? inStock
                ? (isMaxQuantityReached
                    ? 'Đã đạt giới hạn'
                    : `${availableQty} còn lại`)
                : 'Hết hàng'
              : 'Chọn size và màu để xem tồn kho'}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Product Image (schema mới có 1 imageURL) */}
            <div className="space-y-6">
              <div className="bg-gray-100 rounded-xl p-8">
                <img
                  src={currentImage}
                  alt={product?.name}
                  className="w-full h-96 object-contain"
                />
              </div>
              {/* Nếu sau này bạn có nhiều ảnh, có thể render thêm thumbnail ở đây */}
            </div>

            {/* Product Info */}
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {product?.name}
                </h1>
                <div className="flex items-center gap-4">
                  <p className="text-2xl font-semibold text-gray-900">
                    {formatCurrency(product?.price)}
                  </p>
                </div>
                <div className="mt-2 flex gap-4 text-sm text-gray-500">
                  <span>Brand: {product?.brand}</span>
                  <span>Category: {product?.category}</span>
                </div>
              </div>

              {/* Color Selector (attributes.colors: string[]) */}
              {colors.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Color</h3>
                  <div className="flex flex-wrap gap-3">
                    {colors.map((c) => (
                      <button
                        key={c}
                        onClick={() => handleColorSelect(c)}
                        className={`min-w-12 h-12 px-3 rounded-full border-2 transition-colors flex items-center justify-center ${
                          selectedColor?.name === c
                            ? 'border-black ring-2 ring-blue-500'
                            : 'border-gray-200'
                        }`}
                        style={swatchStyle(c)}
                        title={c}
                      >
                        {/* Nếu c không render được màu, hiển thị text */}
                        {!swatchStyle(c).backgroundColor && <span className="text-sm">{c}</span>}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selector (attributes.sizes: string[]) */}
              {sizes.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Size</h3>
                  <div className="grid grid-cols-4 gap-3">
                    {sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => handleSizeSelect(s)}
                        className={`px-4 py-2 border rounded-lg transition-colors ${
                          selectedSize?.name === s
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white text-gray-700 border-gray-200'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Add to Cart */}
              <div className="space-y-4">
                <button
                  className={`w-full py-4 rounded-full font-semibold transition-colors ${
                    !selectedColor || !selectedSize
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : inStock && !isMaxQuantityReached
                        ? 'bg-black text-white hover:bg-gray-800'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  disabled={!selectedColor || !selectedSize || !inStock || isMaxQuantityReached}
                  onClick={handleAddToCart}
                >
                  {!selectedColor || !selectedSize
                    ? 'Chọn size và màu'
                    : !inStock
                      ? 'Hết hàng'
                      : isMaxQuantityReached
                        ? 'Đã đạt giới hạn'
                        : 'Thêm vào giỏ'}
                </button>
              </div>

              {/* Product Description / Features */}
              <div className="pt-8 border-t border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Product Details
                </h3>
                <div className="text-gray-600 space-y-2">
                  {product?.description && <p>{product.description}</p>}
                  {Array.isArray(features) && features.length > 0 && (
                    <ul className="list-disc ml-5 space-y-1">
                      {features.map((f, idx) => <li key={idx}>{f}</li>)}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AlertDialog open={showAlert}>
        <AlertDialogContent className="transition-opacity duration-1000 ">
          <AlertDialogHeader>
            <AlertDialogTitle className={
              alertConfig.variant === "error" ? "text-red-600" :
              alertConfig.variant === "success" ? "text-green-600" :
              "text-gray-900"
            }>
              {alertConfig.title}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {alertConfig.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ProductDetail;
