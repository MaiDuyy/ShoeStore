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
