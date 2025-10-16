import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "../card";
import { Badge } from "../badge";
import { Button } from "../button";
import { ShoppingCartIcon } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useCart } from "@/contexts/CartContext";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import  AddToCartButton  from '../AddToCartButton/AddToCartButton';
// Helper format tiền tệ (tùy app: 'vi-VN' và VND hay 'en-US' và USD)
const formatCurrency = (value, locale = 'vi-VN', currency = 'VND') =>
  new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value || 0);

function ShoppingProductCard({ product, handleGetProductDetails }) {
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();

  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: "",
    description: "",
    variant: "default"
  });

  // ── Map field theo Product schema ──────────────────────────────────────────────
  const productId = product?._id || product?.sku || product?.slug; // ưu tiên _id, fallback sku/slug
  const imageSrc = product?.imageURL;
  const price = Number(product?.price || 0);
  const brand = product?.brand;
  const category = product?.category;
  const name = product?.name;
  const slug = product?.slug;
  const inInventory = !!product?.is_in_inventory;
  const itemsLeft = Number(product?.items_left || 0);
  const sizes = product?.attributes?.sizes || [];
  const colors = product?.attributes?.colors || [];

  // Chọn size & color đầu tiên nếu có (vì schema không có lượng theo biến thể)
  const defaultVariant = useMemo(() => {
    const sizeName = sizes.length ? sizes[0] : null;
    const colorName = colors.length ? colors[0] : null;
    return { sizeName, colorName };
  }, [sizes, colors]);

  // Tổng tồn kho (schema mới: dùng items_left)
  const totalAvailableStock = itemsLeft;

  // Đếm số lượng trong giỏ theo cùng sản phẩm + (nếu có) size/color đang mặc định
  const currentCartQuantity = useMemo(() => {
    if (!Array.isArray(cartItems)) return 0;
    return cartItems.reduce((sum, item) => {
      const sameProduct = item?.id === productId;
      const sameSize = defaultVariant.sizeName ? item?.selectedSize?.name === defaultVariant.sizeName : true;
      const sameColor = defaultVariant.colorName ? item?.selectedColor?.name === defaultVariant.colorName : true;
      return sameProduct && sameSize && sameColor ? sum + (item?.quantity || 0) : sum;
    }, 0);
  }, [cartItems, productId, defaultVariant]);

  const inStock = inInventory && totalAvailableStock > 0;
  const isMaxQuantityReached = inStock ? currentCartQuantity >= totalAvailableStock : true;

  // Auto-close alert nhanh
  useEffect(() => {
    let t;
    if (showAlert) t = setTimeout(() => setShowAlert(false), 400);
    return () => t && clearTimeout(t);
  }, [showAlert]);

  const showAlertDialog = (title, description, variant = "default") => {
    setAlertConfig({ title, description, variant });
    setShowAlert(true);
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    setIsLoading(true);

    try {
      if (!inStock) {
        showAlertDialog("Không thể thêm", "Sản phẩm hiện hết hàng hoặc không có trong kho", "error");
        return;
      }
      if (isMaxQuantityReached) {
        showAlertDialog("Không thể thêm", "Bạn đã đạt số lượng tối đa hiện có cho sản phẩm này", "error");
        return;
      }

      addToCart({
        id: productId,
        name,
        price,
        imageURL: imageSrc,
        quantity: 1,
        selectedColor: defaultVariant.colorName ? { name: defaultVariant.colorName } : null,
        selectedSize: defaultVariant.sizeName ? { name: defaultVariant.sizeName } : null,
        availableQuantity: totalAvailableStock
      });

      const parts = [];
      if (defaultVariant.sizeName) parts.push(`size ${defaultVariant.sizeName}`);
      if (defaultVariant.colorName) parts.push(`màu ${defaultVariant.colorName}`);
      showAlertDialog(
        "Thành công",
        `Đã thêm${parts.length ? ` ${parts.join(', ')}` : ''} vào giỏ hàng!`,
        "success"
      );
    } catch (err) {
      showAlertDialog("Lỗi", "Không thể thêm sản phẩm vào giỏ", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductClick = () => {
    if (slug) navigate(`/product/${slug}`);
    else navigate(`/product/${productId}`);
    if (handleGetProductDetails) handleGetProductDetails(productId);
  };

  return (
    <>
      <Card
        onClick={handleProductClick}
        className="w-full max-w-sm p-0 hover:shadow-lg transition-shadow cursor-pointer"
      >
        <CardHeader className="relative p-0">
          <img
            src={imageSrc}
            alt={name}
            className="object-cover w-full rounded-t-lg aspect-square"
            loading="lazy"
          />
          <div className="absolute top-2 right-2">
            {/* <Button
              disabled={!inStock || isLoading || isMaxQuantityReached}
              onClick={handleAddToCart}
              variant="secondary"
              size="sm"
              className="hover:scale-110 transition-transform active:scale-95"
              title={
                !inStock
                  ? "Hết hàng"
                  : isMaxQuantityReached
                    ? "Đã đạt số lượng tối đa"
                    : "Thêm vào giỏ"
              }
            >
              <ShoppingCartIcon className="w-5 h-5" />
            </Button> */}
            <AddToCartButton
              disabled={!inStock || isLoading || isMaxQuantityReached}
              onClick={handleAddToCart}
              variant="secondary"
              size="sm"
              className="hover:scale-110 transition-transform active:scale-95"
              title={
                !inStock
                  ? "Hết hàng"
                  : isMaxQuantityReached
                    ? "Đã đạt số lượng tối đa"
                    : "Thêm vào giỏ"
              }
              product={product}
              selectedSize={defaultVariant.sizeName ? { name: defaultVariant.sizeName } : null} 
              selectedColor={defaultVariant.colorName ? { name: defaultVariant.colorName } : null}
              quantity={1}
            >

                <ShoppingCartIcon className="w-5 h-5" />
            </AddToCartButton>

            
          </div>
        </CardHeader>

        <CardContent className="p-4">
          <h2 className="mb-2 text-lg font-semibold truncate" title={name}>
            {name}
          </h2>

          <div className="flex gap-2 mb-2 flex-wrap">
            {category && (
              <Badge variant="outline" className="capitalize">{category}</Badge>
            )}
            {brand && (
              <Badge variant="outline" className="capitalize">{brand}</Badge>
            )}
            {defaultVariant.sizeName && (
              <Badge variant="outline">Size: {defaultVariant.sizeName}</Badge>
            )}
            {defaultVariant.colorName && (
              <Badge variant="outline">Color: {defaultVariant.colorName}</Badge>
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xl font-bold">
              {formatCurrency(price)}
            </span>

            <Badge
              variant={
                inStock
                  ? isMaxQuantityReached ? "destructive" : "default"
                  : "destructive"
              }
            >
              {inStock
                ? (isMaxQuantityReached
                    ? "Đã đạt giới hạn"
                    : `${Math.max(totalAvailableStock - currentCartQuantity, 0)} còn lại`)
                : "Hết hàng"}
            </Badge>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          {product?.description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {product.description}
            </p>
          )}
        </CardFooter>
      </Card>

      <AlertDialog open={showAlert}>
        <AlertDialogContent className="transition-opacity duration-1000">
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
}

export default ShoppingProductCard;
