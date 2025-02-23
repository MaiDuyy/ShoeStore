import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "../card";
import { Badge } from "../badge";
import axios from 'axios';
import API_URLS from '../../../config/config';
import { Button } from "../button";
import { ShoppingCartIcon } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// import { addProductToCartThunk } from '@/store/shop/CartSlice';
// import { useToast } from "@/hooks/use-toast";

function ShoppingProductCard({ product, handleGetProductDetails }) {
    // const dispatch = useDispatch();
    const navigate = useNavigate();
     const [currentImage, setCurrentImage] = useState('');
    // const { toast } = useToast();
    // const { user } = useSelector((state) => state.auth);
    const [isLoading, setIsLoading] = useState(false);

    const handleAddToCart = async (e) => {
        e.stopPropagation();
        setIsLoading(true);

        try {
            if (!product.is_available || product.total_stock <= 0) {
                toast({ title: "This product is out of stock" });
                return;
            }

            await dispatch(addProductToCartThunk({
                userId: user.id,
                productId: product.shoes_id,
                quantity: 1,
                totalStock: product.total_stock,
            }));

            toast({ title: "Product added to cart" });
        } catch (error) {
            toast({ 
                title: "Error adding to cart",
                description: error.message,
                variant: "destructive"
            });
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

    return (
        <Card 
            onClick={handleProductClick}
            className="w-full max-w-sm p-0 hover:shadow-lg transition-shadow cursor-pointer"
        >
            <CardHeader className="relative p-0">
                <img
                    src={product.images}
                    alt={product.shoes_name}
                    className="object-cover w-full rounded-t-lg aspect-square"
                    loading="lazy"
                />
                <div className="absolute top-2 right-2">
                    <Button
                        disabled={!product.is_available || product.total_stock <= 0 || isLoading}
                        onClick={handleAddToCart}
                        variant="secondary"
                        size="sm"
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
                </div>
                <div className="flex items-center justify-between">
                    {getPriceDisplay()}
                    <Badge 
                        variant={
                            product.is_available && product.total_stock > 0 
                                ? "default" 
                                : "destructive"
                        }
                    >
                        {product.is_available && product.total_stock > 0
                            ? `${product.total_stock} in stock`
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
    );
}

export default ShoppingProductCard;