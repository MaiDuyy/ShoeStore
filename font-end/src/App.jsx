
import './App.css'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import Home from './page/Home/Home'
import AuthLogin from './page/Auth/Login'
import AuthRegister from './page/Auth/Register'
import ProductDetail from './components/ui/Shoe-detail/ShoeDetail'
import ShoppingProductCard from './components/ui/ProductCard/product-card'
import ShowAllProductsPage from './components/ui/ShowALlProduct/showall'
import ShoppingListing from './page/Listing/listing'


function App() {


  return (
    <>
          <BrowserRouter>
                <Routes>
                <Route path='/auth/login' element = {<AuthLogin/>}/>
                  <Route path='/' element = {<Home/>}/>
                  <Route path='/auth/register' element = {<AuthRegister/>}/>
                  <Route path="/shoes/:maGiay" element={<ProductDetail />} /> 
                  <Route path="/card" element={<ShoppingProductCard />} /> 
                  <Route path="/product" element={<ShowAllProductsPage />} /> 
                  <Route path='/listing' element = {<ShoppingListing/>}/>
                  
                  {/* <Route path='/add' element = {<Add/>}/>
                  <Route path='/update' element = {<Update/>}/>
                  <Route path='/login' element = {<Login/>}/>
                  <Route path="/shoes/:maGiay" element={<ShoeDetail />} /> */}
                </Routes>
          </BrowserRouter>
    </>
  )
}

export default App
