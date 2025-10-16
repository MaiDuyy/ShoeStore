import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './page/Home/Home'
import AuthLogin from './page/Auth/Login'
import AuthRegister from './page/Auth/Register'
import ProductDetail from './components/ui/Shoe-detail/ShoeDetail'
import ShoppingProductCard from './components/ui/ProductCard/product-card'
import ShowAllProductsPage from './components/ui/ShowALlProduct/showall'
import ShoppingListing from './page/Listing/listing'
import Header from './components/ui/Header/Header'
import Footer from './components/ui/Footer/Footer'
import { CartProvider } from './contexts/CartContext'
import About from './page/AboutUs/AboutUs'
import ContactUs from './components/ui/Contact-us/contact-us'
import { ToastContainer } from './components/ui/toast'
import { useToast } from './hooks/use-toast'
import ChatBox from '@/components/ui/ChatBox/ChatBox';
import Cart from './page/Cart/Cart'
import Checkout from './page/Checkout/Checkout'
import OrderSuccess from './page/OrderSuccess/OrderSuccess'
import Orders from './page/Orders/Orders'
import AdminLayout from './page/Admin/AdminLayout'
import Dashboard from './page/Admin/Dashboard'
import ProductManagement from './page/Admin/ProductManagement'
import OrderManagement from './page/Admin/OrderManagement'
import UserManagement from './page/Admin/UserManagement'
import Profile from './page/Profile/Profile'
import OrderDetail from './page/Orders/OrderDetail'

import { AuthProvider } from "@/contexts/AuthContext";
function ToastProvider({ children }) {
  const { toasts } = useToast();
  
  return (
    <>
      {children}
      <ToastContainer 
        toasts={toasts}
        onClose={(id) => {
         
        }}
      />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <Header />
          <ChatBox />
          <div className="pt-[72px]">
            <Routes>
              <Route path="/" element={<Home/>}/>
              <Route path="/listing" element={<ShoppingListing/>}/>
              <Route path="/about" element={<About/>}/>
              <Route path="/contact" element={<ContactUs/>}/>
              <Route path='/auth/login' element = {<AuthLogin/>}/>
              <Route path='/auth/register' element = {<AuthRegister/>}/>
              <Route path="/product/:id" element={<ProductDetail />} /> 
              <Route path="/card" element={<ShoppingProductCard />} /> 
              <Route path="/product" element={<ShowAllProductsPage />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/orders/:id" element={<OrderDetail />} />
              <Route path="/profile" element={<Profile />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="products" element={<ProductManagement />} />
                <Route path="orders" element={<OrderManagement />} />
                <Route path="users" element={<UserManagement />} />
              </Route>
            </Routes>
          </div>
          <Footer/>
        </ToastProvider>
      </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
