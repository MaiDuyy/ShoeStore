import { useState } from 'react'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import Home from './pages/Home/home'
import AuthLogin from './pages/Auth/Login'
import AuthRegister from './pages/Auth/Register'



function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
     <>
        <BrowserRouter>
                <Routes>
              
                  <Route path='/' element = {<Home/>}/>
                  <Route path='/auth/login' element = {<AuthLogin setIsLoggedIn={setIsLoggedIn}/>}/>
                  <Route path='/auth/register' element = {<AuthRegister/>}/>
                </Routes>
          </BrowserRouter>
    </>
  )
}

export default App
