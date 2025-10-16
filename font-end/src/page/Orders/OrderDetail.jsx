import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderById, cancelOrder } from '../../redux/features/orderSlice';
import { ArrowLeft, Package, MapPin, CreditCard, Calendar, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentOrder, loading } = useSelector((state) => state.order);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderById(id));
    }
  }, [dispatch, id]);

  const handleCancelOrder = async () => {
    if (!window.confirm('Bạn có chắc muốn hủy đơn hàng này?')) return;

    setCancelling(true);
    try {
      await dispatch(cancelOrder(id)).unwrap();
      toast.success('Đã hủy đơn hàng');
    } catch (error) {
      toast.error(error || 'Không thể hủy đơn hàng');
    } finally {
      setCancelling(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusText = (status) => {
    const statusMap = {
      PENDING: 'Chờ xác nhận',
      CONFIRMED: 'Đã xác nhận',
      SHIPPING: 'Đang giao',
      DELIVERED: 'Đã giao',
      CANCELLED: 'Đã hủy'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      CONFIRMED: 'bg-blue-100 text-blue-800 border-blue-300',
      SHIPPING: 'bg-purple-100 text-purple-800 border-purple-300',
      DELIVERED: 'bg-green-100 text-green-800 border-green-300',
      CANCELLED: 'bg-red-100 text-red-800 border-red-300'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getPaymentMethodText = (method) => {
    const methodMap = {
      COD: 'Thanh toán khi nhận hàng',
      BANK_TRANSFER: 'Chuyển khoản ngân hàng',
      CREDIT_CARD: 'Thẻ tín dụng'
    };
    return methodMap[method] || method;
  };

  const getStatusSteps = (status) => {
    const steps = [
      { key: 'PENDING', label: 'Chờ xác nhận', icon: '📝' },
      { key: 'CONFIRMED', label: 'Đã xác nhận', icon: '✅' },
      { key: 'SHIPPING', label: 'Đang giao', icon: '🚚' },
      { key: 'DELIVERED', label: 'Đã giao', icon: '📦' }
    ];

    if (status === 'CANCELLED') {
      return [{ key: 'CANCELLED', label: 'Đã hủy', icon: '❌', active: true }];
    }

    const statusOrder = ['PENDING', 'CONFIRMED', 'SHIPPING', 'DELIVERED'];
    const currentIndex = statusOrder.indexOf(status);

    return steps.map((step, index) => ({
      ...step,
      active: index <= currentIndex,
      current: step.key === status
    }));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Đang tải...</div>
      </div>
    );
  }

  if (!currentOrder) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Không tìm thấy đơn hàng</p>
          <Button onClick={() => navigate('/orders')}>Quay lại danh sách</Button>
        </div>
      </div>
    );
  }

  const statusSteps = getStatusSteps(currentOrder.status);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/orders')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Đơn hàng #{currentOrder.orderNumber}</h1>
            <p className="text-gray-600 mt-1">
              Đặt ngày {formatDate(currentOrder.createdAt)}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(currentOrder.status)}`}>
              {getStatusText(currentOrder.status)}
            </span>
            {currentOrder.status === 'PENDING' && (
              <Button
                variant="outline"
                onClick={handleCancelOrder}
                disabled={cancelling}
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                {cancelling ? 'Đang hủy...' : 'Hủy đơn'}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Status Timeline */}
      {currentOrder.status !== 'CANCELLED' && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Trạng thái đơn hàng</h2>
          <div className="flex items-center justify-between">
            {statusSteps.map((step, index) => (
              <div key={step.key} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                    step.active ? 'bg-blue-100' : 'bg-gray-100'
                  } ${step.current ? 'ring-4 ring-blue-300' : ''}`}>
                    {step.icon}
                  </div>
                  <p className={`mt-2 text-sm text-center ${
                    step.active ? 'font-semibold text-gray-900' : 'text-gray-500'
                  }`}>
                    {step.label}
                  </p>
                </div>
                {index < statusSteps.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 ${
                    step.active ? 'bg-blue-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Products */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Package className="w-5 h-5" />
                Sản phẩm ({currentOrder.items.length})
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {currentOrder.items.map((item, index) => (
                <div key={index} className="flex gap-4 pb-4 border-b last:border-b-0">
                  <img
                    src={item.imageURL}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <div className="text-sm text-gray-600 mt-1 space-y-1">
                      {item.size && <p>Size: {item.size}</p>}
                      {item.color && <p>Màu: {item.color}</p>}
                      <p>Số lượng: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Đơn giá</p>
                    <p className="font-semibold">{formatPrice(item.price)}</p>
                    <p className="text-sm text-gray-600 mt-2">Thành tiền</p>
                    <p className="font-bold text-blue-600">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5" />
              Địa chỉ giao hàng
            </h2>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="font-semibold min-w-[100px]">Người nhận:</span>
                <span>{currentOrder.shippingAddress.fullName}</span>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-1 text-gray-400" />
                <span>{currentOrder.shippingAddress.phone}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 text-gray-400" />
                <span>
                  {currentOrder.shippingAddress.address}
                  {currentOrder.shippingAddress.ward && `, ${currentOrder.shippingAddress.ward}`}
                  {currentOrder.shippingAddress.district && `, ${currentOrder.shippingAddress.district}`}
                  {`, ${currentOrder.shippingAddress.city}`}
                </span>
              </div>
            </div>
          </div>

          {/* Note */}
          {currentOrder.note && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Ghi chú</h2>
              <p className="text-gray-700">{currentOrder.note}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Payment Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5" />
              Thanh toán
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Phương thức:</span>
                <span className="font-medium">{getPaymentMethodText(currentOrder.paymentMethod)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Trạng thái:</span>
                <span className={`font-medium ${currentOrder.isPaid ? 'text-green-600' : 'text-orange-600'}`}>
                  {currentOrder.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                </span>
              </div>
              {currentOrder.paidAt && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Thanh toán lúc:</span>
                  <span className="font-medium">{formatDate(currentOrder.paidAt)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Tổng đơn hàng</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Tạm tính:</span>
                <span className="font-medium">{formatPrice(currentOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phí vận chuyển:</span>
                <span className="font-medium">
                  {currentOrder.shippingFee === 0 ? 'Miễn phí' : formatPrice(currentOrder.shippingFee)}
                </span>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <span className="text-lg font-bold">Tổng cộng:</span>
                <span className="text-xl font-bold text-blue-600">
                  {formatPrice(currentOrder.totalAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Delivery Info */}
          {currentOrder.deliveredAt && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h2 className="text-lg font-bold text-green-800 flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5" />
                Đã giao hàng
              </h2>
              <p className="text-sm text-green-700">
                {formatDate(currentOrder.deliveredAt)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
