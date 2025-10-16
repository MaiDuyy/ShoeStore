import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCart, updateCartItem, removeFromCart } from '../../redux/features/cartSlice';
import { toast } from 'react-toastify';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalAmount, loading } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleUpdateQuantity = async (item, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      await dispatch(updateCartItem({
        productId: item.product._id,
        quantity: newQuantity,
        size: item.size,
        color: item.color
      })).unwrap();
      toast.success('Cập nhật giỏ hàng thành công');
    } catch (error) {
      toast.error(error || 'Không thể cập nhật giỏ hàng');
    }
  };

  const handleRemove = async (item) => {
    try {
      await dispatch(removeFromCart({
        productId: item.product._id,
        size: item.size,
        color: item.color
      })).unwrap();
      toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
    } catch (error) {
      toast.error(error || 'Không thể xóa sản phẩm');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Đang tải...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Giỏ hàng trống</h2>
        <p className="text-gray-600 mb-8">Bạn chưa có sản phẩm nào trong giỏ hàng</p>
        <button
          onClick={() => navigate('/products')}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Tiếp tục mua sắm
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Giỏ hàng của bạn</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {items.map((item) => (
            <div key={`${item.product._id}-${item.size}-${item.color}`} className="flex gap-4 border-b py-4">
              <img
                src={item.product.imageURL}
                alt={item.product.name}
                className="w-24 h-24 object-cover rounded"
              />
              
              <div className="flex-1">
                <h3 className="font-semibold">{item.product.name}</h3>
                <p className="text-sm text-gray-600">{item.product.brand}</p>
                {item.size && <p className="text-sm">Size: {item.size}</p>}
                {item.color && <p className="text-sm">Màu: {item.color}</p>}
                <p className="text-lg font-bold mt-2">{formatPrice(item.price)}</p>
              </div>
              
              <div className="flex flex-col items-end justify-between">
                <button
                  onClick={() => handleRemove(item)}
                  className="text-red-600 hover:text-red-800"
                >
                  Xóa
                </button>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                    className="w-8 h-8 border rounded hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="w-12 text-center">{item.quantity}</span>
                  <button
                    onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                    className="w-8 h-8 border rounded hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-4">Tóm tắt đơn hàng</h2>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Tạm tính:</span>
                <span>{formatPrice(totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển:</span>
                <span>{totalAmount >= 500000 ? 'Miễn phí' : formatPrice(30000)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Tổng cộng:</span>
                <span>{formatPrice(totalAmount + (totalAmount >= 500000 ? 0 : 30000))}</span>
              </div>
            </div>
            
            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold"
            >
              Tiến hành thanh toán
            </button>
            
            <button
              onClick={() => navigate('/products')}
              className="w-full mt-3 border border-gray-300 py-3 rounded-lg hover:bg-gray-50"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
