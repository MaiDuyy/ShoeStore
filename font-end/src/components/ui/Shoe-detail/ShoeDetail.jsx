import React, { useEffect, useState } from 'react';
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

const ProductDetail = () => {
    const { maGiay } = useParams();
    const [product, setProduct] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [currentImage, setCurrentImage] = useState('');
    const [availableQuantities, setAvailableQuantities] = useState({});
    const { addToCart, cartItems } = useCart();
    const [showAlert, setShowAlert] = useState(false);
    const [alertConfig, setAlertConfig] = useState({
        title: "",
        description: "",
        variant: "default"
    });

    // Effect để tự động đóng alert sau 0.4 giây
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

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/ap/shoes/${maGiay}`);
                setProduct(response.data);
                setCurrentImage(response.data.images[0]);
                
                // Tạo bản đồ số lượng tồn kho
                const quantityMap = response.data.quantities.reduce((acc, item) => {
                    const key = `${item.color_id}-${item.size_id}`;
                    acc[key] = {
                        quantity: item.quantity,
                        color_name: item.color_name,
                        size_name: item.size_name
                    };
                    return acc;
                }, {});
                setAvailableQuantities(quantityMap);
                
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };
        
        fetchProduct();
    }, [maGiay]);

    const showAlertDialog = (title, description, variant = "default") => {
        setAlertConfig({ title, description, variant });
        setShowAlert(true);
    };

    const handleSizeSelect = (sizeId, sizeName) => {
        setSelectedSize({ id: sizeId, name: sizeName });
    };

    const handleColorSelect = (colorId, colorName) => {
        setSelectedColor({ id: colorId, name: colorName });
    };

    const getAvailableQuantity = () => {
        if (selectedColor?.id && selectedSize?.id) {
            const key = `${selectedColor.id}-${selectedSize.id}`;
            return availableQuantities[key]?.quantity || 0;
        }
        return 0;
    };

    // Kiểm tra số lượng trong giỏ hàng
    const getCurrentCartQuantity = () => {
        const cartItem = cartItems.find(item => 
            item.id === product?.shoes_id && 
            item.selectedColor?.id === selectedColor?.id &&
            item.selectedSize?.id === selectedSize?.id
        );
        return cartItem?.quantities || 0;
    };

    const handleAddToCart = () => {
        if (!selectedColor || !selectedSize) {
            showAlertDialog(
                "Cannot add to cart",
                "Please select both size and color",
                "error"
            );
            return;
        }

        const availableQty = getAvailableQuantity();
        const currentCartQty = getCurrentCartQuantity();

        if (availableQty <= 0) {
            showAlertDialog(
                "Cannot add to cart",
                "This variant is out of stock",
                "error"
            );
            return;
        }

        if (currentCartQty >= availableQty) {
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
            images: product.images[0],
            quantity: 1,
            selectedColor: selectedColor,
            selectedSize: selectedSize,
            availableQuantity: availableQty
        });

        showAlertDialog(
            "Success",
            `Added size ${selectedSize.name}, color ${selectedColor.name} to cart!`,
            "success"
        );
    };

    if (!product) return <div className="text-center mt-10">Loading...</div>;

    const currentCartQty = getCurrentCartQuantity();
    const availableQty = getAvailableQuantity();
    const isMaxQuantityReached = currentCartQty >= availableQty;

    return (
        <>
            <div className="bg-white min-h-screen">
                <div className="container mx-auto px-6 py-12">
                    {/* Stock Status */}
                    <div className={`mb-4 text-sm font-medium ${
                        selectedColor && selectedSize
                            ? availableQty > 0 
                                ? isMaxQuantityReached ? 'text-red-600' : 'text-green-600'
                                : 'text-red-600'
                            : 'text-gray-600'
                    }`}>
                        {selectedColor && selectedSize
                            ? availableQty > 0
                                ? isMaxQuantityReached
                                    ? 'Max quantity reached'
                                    : `${availableQty - currentCartQty} available`
                                : 'Out of stock'
                            : 'Select size and color to check availability'}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Product Images */}
                        <div className="space-y-6">
                            <div className="bg-gray-100 rounded-xl p-8">
                                <img 
                                    src={currentImage} 
                                    alt={product.shoes_name}
                                    className="w-full h-96 object-contain"
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                {product.images.map((img, index) => (
                                    <div 
                                        key={index}
                                        className={`border-2 rounded-lg p-2 cursor-pointer transition-colors ${
                                            currentImage === img ? 'border-black' : 'border-gray-200'
                                        }`}
                                        onClick={() => setCurrentImage(img)}
                                    >
                                        <img 
                                            src={img} 
                                            alt={`Product view ${index + 1}`}
                                            className="w-full h-24 object-contain"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="space-y-8">
                            <div>
                                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                                    {product.shoes_name}
                                </h1>
                                <div className="flex items-center gap-4">
                                    <p className="text-2xl font-semibold text-gray-900">
                                        ${product.sale_price.toFixed(2)}
                                    </p>
                                    {product.sale_price < product.original_price && (
                                        <p className="text-xl text-gray-500 line-through">
                                            ${product.original_price.toFixed(2)}
                                        </p>
                                    )}
                                </div>
                                <div className="mt-2 flex gap-4 text-sm text-gray-500">
                                    <span>Brand: {product.brand}</span>
                                    <span>Category: {product.category}</span>
                                </div>
                            </div>

                            {/* Color Selector */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Color</h3>
                                <div className="flex flex-wrap gap-3">
                                    {product.availableColors.map(color => (
                                        <button
                                            key={color.color_id}
                                            onClick={() => handleColorSelect(color.color_id, color.color_name)}
                                            className={`w-12 h-12 rounded-full border-2 transition-colors flex items-center justify-center ${
                                                selectedColor?.id === color.color_id
                                                    ? 'border-black ring-2 ring-blue-500'
                                                    : 'border-gray-200'
                                            }`}
                                            style={{ backgroundColor: color.color_name }}
                                            title={color.color_name}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Size Selector */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Size</h3>
                                <div className="grid grid-cols-4 gap-3">
                                    {product.availableSizes.map(size => (
                                        <button
                                            key={size.size_id}
                                            onClick={() => handleSizeSelect(size.size_id, size.size_name)}
                                            className={`px-4 py-2 border rounded-lg transition-colors ${
                                                selectedSize?.id === size.size_id
                                                    ? 'bg-blue-500 text-white border-blue-500'
                                                    : 'bg-white text-gray-700 border-gray-200'
                                            }`}
                                        >
                                            {size.size_name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Add to Cart */}
                            <div className="space-y-4">
                                <button 
                                    className={`w-full py-4 rounded-full font-semibold transition-colors ${
                                        !selectedColor || !selectedSize
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : availableQty > 0 && !isMaxQuantityReached
                                                ? 'bg-black text-white hover:bg-gray-800'
                                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                                    disabled={!selectedColor || !selectedSize || availableQty <= 0 || isMaxQuantityReached}
                                    onClick={handleAddToCart}
                                >
                                    {!selectedColor || !selectedSize
                                        ? 'Select size and color'
                                        : availableQty <= 0
                                            ? 'Out of Stock'
                                            : isMaxQuantityReached
                                                ? 'Max quantity reached'
                                                : 'Add to Cart'}
                                </button>
                            </div>

                            {/* Product Description */}
                            <div className="pt-8 border-t border-gray-200">
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                    Product Details
                                </h3>
                                <div className="text-gray-600 space-y-2">
                                    <p>{product.description}</p>
                                    <p>VAT: {product.vat}%</p>
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