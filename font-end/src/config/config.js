const API_BASE_URL = 'http://localhost:5000'; 

const API_URLS = {
    GET_PRODUCTS: `${API_BASE_URL}/api/shoes`, // Lấy danh sách sản phẩm
    GET_PRODUCTS_DETAILS:(maGiay) => `${API_BASE_URL}/api/shoes/${maGiay}`,
    // GET_TABLE: (qr_code) => `${API_BASE_URL}/tables?code=${qr_code}`, // Lấy thông tin bàn
    // POST_ORDER: `${API_BASE_URL}/api/order`, // Đặt hàng
    // GET_ORDERS_FROM_TABLE: (qr_code) => `${API_BASE_URL}/api/table/${qr_code}/details-orders`, // Lấy chi tiết danh sách đơn hàng từ bàn
    // POST_CLIENT: `${API_BASE_URL}/api/clients`, // Đăng ký khách hàng
    // GET_CLIENT_BY_PHONE: (phone) => `${API_BASE_URL}/api/clients/search?phone=${phone}`, // Lấy thông tin khách hàng theo số điện thoại
    // GET_ORDER_DETAILS: (qr_code) => `${API_BASE_URL}/api/orders?direction=${qr_code}`, // Lấy dữ liệu cho từng đơn hàng
    // POST_VNPAY: `${API_BASE_URL}/vnpay`, // Đẩy dữ liệu lên cho VN Pay
    // GET_VNPAY_CALLBACK:  (queryParams) => `${API_BASE_URL}/vnpay-callback${queryParams}`, // Lấy dữ liệu của VN Pay
    // GENERATE_QR_CODE: (tableId) => `${API_BASE_URL}/tables/generateQRCode/${tableId}` // Lấy mã QR mới
};

export default API_URLS;