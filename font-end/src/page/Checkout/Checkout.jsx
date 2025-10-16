import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchCart } from '../../redux/features/cartSlice';
import { createOrder, resetOrderState } from '../../redux/features/orderSlice';
import { toast } from 'react-toastify';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { items, totalAmount } = useSelector((state) => state.cart);
  const { loading, success, error } = useSelector((state) => state.order);
  
  // Get selected items from navigation state
  const selectedItemKeys = location.state?.selectedItems || [];

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    ward: '',
    paymentMethod: 'COD',
    note: ''
  });

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  // Filter items based on selection
  const checkoutItems = selectedItemKeys.length > 0
    ? items.filter(item => {
        const itemKey = `${item.product._id}-${item.size}-${item.color}`;
        return selectedItemKeys.includes(itemKey);
      })
    : items;

  useEffect(() => {
    if (success) {
      toast.success('Đặt hàng thành công!');
      navigate('/order-success');
      dispatch(resetOrderState());
    }
    if (error) {
      toast.error(error);
    }
  }, [success, error, navigate, dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (checkoutItems.length === 0) {
      toast.error('Không có sản phẩm nào để thanh toán');
      return;
    }
    
    if (!formData.fullName || !formData.phone || !formData.address || !formData.city) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    const orderData = {
      shippingAddress: {
        fullName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        district: formData.district,
        ward: formData.ward
      },
      paymentMethod: formData.paymentMethod,
      note: formData.note,
      selectedItems: selectedItemKeys // Send selected items to backend
    };

    dispatch(createOrder(orderData));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  // Calculate total for selected items only
  const checkoutTotal = checkoutItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingFee = checkoutTotal >= 500000 ? 0 : 30000;
  const finalTotal = checkoutTotal + shippingFee;

  if (checkoutItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Giỏ hàng trống</h2>
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
      <h1 className="text-3xl font-bold mb-8">Thanh toán</h1>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Thông tin giao hàng</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Họ và tên *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Số điện thoại *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2"
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Địa chỉ *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Tỉnh/Thành phố *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Quận/Huyện</label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Phường/Xã</label>
                <input
                  type="text"
                  name="ward"
                  value={formData.ward}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2"
                />
              </div>
            </div>
          </div>
          
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Phương thức thanh toán</h2>
            
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={formData.paymentMethod === 'COD'}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <span>Thanh toán khi nhận hàng (COD)</span>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="BANK_TRANSFER"
                  checked={formData.paymentMethod === 'BANK_TRANSFER'}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <span>Chuyển khoản ngân hàng</span>
              </label>
            </div>
          </div>
          
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Ghi chú đơn hàng</h2>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              rows="4"
              className="w-full border rounded-lg px-4 py-2"
              placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."
            />
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-4">Đơn hàng của bạn</h2>
            
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {checkoutItems.map((item) => (
                <div key={`${item.product._id}-${item.size}-${item.color}`} className="flex gap-3">
                  <img
                    src={item.product.imageURL}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.product.name}</p>
                    <p className="text-xs text-gray-600">SL: {item.quantity}</p>
                    {item.size && <p className="text-xs">Size: {item.size}</p>}
                  </div>
                  <p className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Số sản phẩm:</span>
                <span>{checkoutItems.length} sản phẩm</span>
              </div>
              <div className="flex justify-between">
                <span>Tạm tính:</span>
                <span>{formatPrice(checkoutTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển:</span>
                <span>{shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Tổng cộng:</span>
                <span className="text-blue-600">{formatPrice(finalTotal)}</span>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold disabled:bg-gray-400"
            >
              {loading ? 'Đang xử lý...' : 'Đặt hàng'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
