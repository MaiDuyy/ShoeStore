import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const { currentOrder } = useSelector((state) => state.order);

  useEffect(() => {
    if (!currentOrder) {
      navigate('/');
    }
  }, [currentOrder, navigate]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  if (!currentOrder) return null;

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-green-600 mb-2">Đặt hàng thành công!</h1>
          <p className="text-gray-600">Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ liên hệ với bạn sớm nhất.</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
          <h2 className="text-xl font-bold mb-4">Thông tin đơn hàng</h2>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Mã đơn hàng:</span>
              <span className="font-semibold">{currentOrder.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tổng tiền:</span>
              <span className="font-semibold text-blue-600">{formatPrice(currentOrder.totalAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Phương thức thanh toán:</span>
              <span className="font-semibold">
                {currentOrder.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng' : 'Chuyển khoản'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Trạng thái:</span>
              <span className="font-semibold text-yellow-600">Đang xử lý</span>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Địa chỉ giao hàng:</h3>
            <p className="text-gray-700">{currentOrder.shippingAddress.fullName}</p>
            <p className="text-gray-700">{currentOrder.shippingAddress.phone}</p>
            <p className="text-gray-700">
              {currentOrder.shippingAddress.address}, {currentOrder.shippingAddress.ward && `${currentOrder.shippingAddress.ward}, `}
              {currentOrder.shippingAddress.district && `${currentOrder.shippingAddress.district}, `}
              {currentOrder.shippingAddress.city}
            </p>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate('/orders')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Xem đơn hàng
          </button>
          <button
            onClick={() => navigate('/')}
            className="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
