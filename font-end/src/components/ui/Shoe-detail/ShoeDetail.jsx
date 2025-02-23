import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ProductDetail = () => {
    const { maGiay } = useParams();
    const [product, setProduct] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [currentImage, setCurrentImage] = useState('');
    const [availableQuantities, setAvailableQuantities] = useState([]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/ap/shoes/${maGiay}`);
                setProduct(response.data);
                setCurrentImage(response.data.images[0]);
                
                // Tạo bản đồ số lượng tồn kho
                const quantityMap = response.data.quantities.reduce((acc, item) => {
                    const key = `${item.color_id}-${item.size_id}`;
                    acc[key] = item.quantity;
                    return acc;
                }, {});
                setAvailableQuantities(quantityMap);
                
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };
        
        fetchProduct();
    }, [maGiay]);

    const handleSizeSelect = (sizeId) => {
        setSelectedSize(sizeId);
        // Reset màu khi chọn size mới
        setSelectedColor(null);
    };

    const handleColorSelect = (colorId) => {
        setSelectedColor(colorId);
    };

    const getAvailableQuantity = () => {
        if (selectedColor && selectedSize) {
            const key = `${selectedColor}-${selectedSize}`;
            return availableQuantities[key] || 0;
        }
        return 0;
    };

    if (!product) return <div className="text-center mt-10">Loading...</div>;

    return (
        <div className="bg-white min-h-screen">
            <div className="container mx-auto px-6 py-12">
                {/* Stock Status */}
                <div className={`mb-4 text-sm font-medium ${
                    getAvailableQuantity() > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                    {getAvailableQuantity() > 0 
                        ? `${getAvailableQuantity()} in stock` 
                        : 'Out of stock'}
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
                                        onClick={() => handleColorSelect(color.color_id)}
                                        className={`w-12 h-12 rounded-full border-2 transition-colors flex items-center justify-center ${
                                            selectedColor === color.color_id
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
                                        onClick={() => handleSizeSelect(size.size_id)}
                                        className={`px-4 py-2 border rounded-lg transition-colors ${
                                            selectedSize === size.size_id
                                                ? 'bg-blue-500 text-white border-blue-500'
                                                : 'bg-white text-gray-700 border-gray-200'
                                        } ${
                                            !selectedColor ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                        disabled={!selectedColor}
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
                                    getAvailableQuantity() > 0
                                        ? 'bg-black text-white hover:bg-gray-800'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                                disabled={getAvailableQuantity() <= 0}
                            >
                                {getAvailableQuantity() > 0 ? 'Add to Cart' : 'Out of Stock'}
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
    );
};

export default ProductDetail;