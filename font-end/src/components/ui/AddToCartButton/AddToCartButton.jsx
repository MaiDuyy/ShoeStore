import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../../redux/features/cartSlice';
import { toast } from 'react-toastify';

const AddToCartButton = ({ product, selectedSize, selectedColor, quantity = 1 }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    if (!product) return;

    // Extract string values from objects if needed
    const sizeValue = typeof selectedSize === 'object' ? selectedSize?.name : selectedSize;
    const colorValue = typeof selectedColor === 'object' ? selectedColor?.name : selectedColor;

    setLoading(true);
    try {
      await dispatch(addToCart({
        productId: product._id,
        quantity,
        size: sizeValue || null,
        color: colorValue || null
      })).unwrap();
      
      toast.success('Đã thêm vào giỏ hàng!');
    } catch (error) {
      toast.error(error || 'Không thể thêm vào giỏ hàng');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={loading || !product?.is_in_inventory}
      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
    >
      {loading ? 'Đang thêm...' : !product?.is_in_inventory ? 'Hết hàng' : 'Thêm vào giỏ'}
    </button>
  );
};

export default AddToCartButton;
