import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "../card";
import { Badge } from "../badge";
import { Button } from "../button";
import { ShoppingCartIcon } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useCart } from "@/contexts/CartContext";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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

    // Effect để tự động đóng alert sau 1 giây
    useEffect(() => {
        let timeoutId;
        if (showAlert) {
            timeoutId = setTimeout(() => {
                setShowAlert(false);
            }, 400);
        }
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [showAlert]);

    // Tìm size và màu đầu tiên có sẵn trong kho
    const firstAvailableVariant = useMemo(() => {
        if (!product.quantities || !Array.isArray(product.quantities)) {
            return null;
        }
        // Tìm variant đầu tiên có số lượng > 0
        const availableVariant = product.quantities.find(q => q.quantity > 0);
        if (!availableVariant) {
            return null;
        }
        return {
            colorId: availableVariant.color_id,
            colorName: availableVariant.color_name,
            sizeId: availableVariant.size_id,
            sizeName: availableVariant.size_name,
            quantity: availableVariant.quantity
        };
    }, [product.quantities]);

    // Calculate total available stock across all color/size combinations
    const totalAvailableStock = useMemo(() => {
        if (!product.quantities || !Array.isArray(product.quantities)) {
            return 0;
        }
        return product.quantities.reduce((sum, item) => sum + item.quantity, 0);
    }, [product.quantities]);

    // Kiểm tra số lượng hiện có trong giỏ hàng cho variant cụ thể
    const currentCartQuantity = useMemo(() => {
        const cartItem = cartItems.find(item => 
            item.id === product.shoes_id && 
            item.selectedColor?.id === firstAvailableVariant?.colorId &&
            item.selectedSize?.id === firstAvailableVariant?.sizeId
        );
        return cartItem?.quantities || 0;
    }, [cartItems, product.shoes_id, firstAvailableVariant]);

    const showAlertDialog = (title, description, variant = "default") => {
        setAlertConfig({ title, description, variant });
        setShowAlert(true);
    };

    const handleAddToCart = async (e) => {
        e.stopPropagation();
        setIsLoading(true);

        try {
            if (!firstAvailableVariant) {
                showAlertDialog(
                    "Cannot add to cart",
                    "No available variants for this product",
                    "error"
                );
                return;
            }

            // Kiểm tra nếu thêm vào sẽ vượt quá số lượng trong kho của variant cụ thể
            if (currentCartQuantity >= firstAvailableVariant.quantity) {
                showAlertDialog(
                    "Cannot add more",
                    "You've reached the maximum available quantity for this variant",
                    "error"
                );
                return;
            }

            addToCart({
                id: product.shoes_id,
                shoes_name: product.shoes_name,
                price: product.sale_price || product.original_price,
                images: product.images,
                quantity: 1,
                selectedColor: {
                    id: firstAvailableVariant.colorId,
                    name: firstAvailableVariant.colorName
                },
                selectedSize: {
                    id: firstAvailableVariant.sizeId,
                    name: firstAvailableVariant.sizeName
                },
                availableQuantity: firstAvailableVariant.quantity
            });

            showAlertDialog(
                "Success",
                `Added size ${firstAvailableVariant.sizeName}, color ${firstAvailableVariant.colorName} to cart!`,
                "success"
            );
        } catch (error) {
            showAlertDialog(
                "Error",
                "Failed to add product to cart",
                "error"
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleProductClick = () => {
        navigate(`/shoes/${product.shoes_id}`);
        if (handleGetProductDetails) {
            handleGetProductDetails(product.shoes_id);
        }
    };

    const getPriceDisplay = () => {
        if (product.sale_price < product.original_price) {
            return (
                <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-red-600">
                        ${product.sale_price.toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                        ${product.original_price.toFixed(2)}
                    </span>
                </div>
            );
        }
        return (
            <span className="text-xl font-bold">
                ${product.original_price.toFixed(2)}
            </span>
        );
    };

    // Kiểm tra nếu đã thêm đủ số lượng trong kho cho variant cụ thể
    const isMaxQuantityReached = firstAvailableVariant 
        ? currentCartQuantity >= firstAvailableVariant.quantity 
        : true;

    return (
        <>
            <Card 
                onClick={handleProductClick}
                className="w-full max-w-sm p-0 hover:shadow-lg transition-shadow cursor-pointer"
            >
                <CardHeader className="relative p-0">
                    <img
                        src={product.images[0] || product.images}
                        alt={product.shoes_name}
                        className="object-cover w-full rounded-t-lg aspect-square"
                        loading="lazy"
                    />
                    <div className="absolute top-2 right-2">
                        <Button
                            disabled={!firstAvailableVariant || isLoading || isMaxQuantityReached}
                            onClick={handleAddToCart}
                            variant="secondary"
                            size="sm"
                            className="hover:scale-110 transition-transform active:scale-95"
                            title={
                                !firstAvailableVariant 
                                    ? "No available variants" 
                                    : isMaxQuantityReached 
                                        ? "Maximum quantity reached" 
                                        : `Add size ${firstAvailableVariant.sizeName}, color ${firstAvailableVariant.colorName}`
                            }
                        >
                            <ShoppingCartIcon className="w-5 h-5" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-4">
                    <h2 className="mb-2 text-lg font-semibold truncate" title={product.shoes_name}>
                        {product.shoes_name}
                    </h2>
                    <div className="flex gap-2 mb-2 flex-wrap">
                        <Badge variant="outline" className="capitalize">
                            {product.category_name}
                        </Badge>
                        <Badge variant="outline" className="capitalize">
                            {product.brand_name}
                        </Badge>
                        {firstAvailableVariant && (
                            <>
                                <Badge variant="outline">
                                    Size: {firstAvailableVariant.sizeName}
                                </Badge>
                                <Badge variant="outline">
                                    Color: {firstAvailableVariant.colorName}
                                </Badge>
                            </>
                        )}
                    </div>
                    <div className="flex items-center justify-between">
                        {getPriceDisplay()}
                        <Badge 
                            variant={
                                firstAvailableVariant
                                    ? isMaxQuantityReached ? "destructive" : "default"
                                    : "destructive"
                            }
                        >
                            {firstAvailableVariant
                                ? isMaxQuantityReached 
                                    ? "Max quantity reached"
                                    : `${firstAvailableVariant.quantity - currentCartQuantity} available`
                                : "Out of stock"}
                        </Badge>
                    </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                    <p className="text-sm text-gray-600 line-clamp-2">
                        {product.description}
                    </p>
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