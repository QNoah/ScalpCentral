import './App.css';
import { Routes, Route } from 'react-router-dom';
import { RegisterPage, LoginPage } from "./Components/Pages/AuthPages";
import { SearchResults } from './Components/Pages/SearchResults';
import { ProductPage } from './Components/Pages/ProductPage';
import { HomePage } from "./Components/Pages/MainPage"
import { useEffect, useState } from "react";
import OrderConfirmation from './Components/Pages/OrderConfirmation';
import ProductList from './Components/Pages/Admin/ProductList';
import { CartPage } from './Components/Pages/CartPage';
import CheckoutPage from './Components/Pages/CheckoutPage';
import Footer from './Components/PageParts/Footer';
import ProductEdit from './Components/Pages/Admin/ProductEdit';
import { ResetPasswordPage } from './Components/Pages/ResetPasswordPage';
import UserList from './Components/Pages/Admin/UserList';
import ProfilePage from './Components/Pages/ProfilePage';
import { FAQPage } from './Components/Pages/FAQPage';
import OrderHistoryPage from './Components/Pages/OrderHistoryPage';
import { ContactPage } from './Components/Pages/ContactPage';
import AdminRoute from './Components/Functionalities/AdminRoute';
import SalesOverview from './Components/Pages/Admin/SalesOverview';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      console.log(event.key, event.shiftKey, event.altKey);
      if (event.shiftKey && event.altKey && event.key === "D") {
        console.log("Toggling debug mode");
        document.body.classList.toggle("debug");
        const isDebugMode = document.body.classList.contains("debug");
        localStorage.setItem("debugMode", isDebugMode ? "true" : "false");
      }
    };

    if (localStorage.getItem("debugMode") === "true") {
      document.body.classList.add("debug");
    } else {
      document.body.classList.remove("debug");
    }
    
    console.log("listener added");
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="app-shell flex flex-col min-h-screen">
      <main className="flex-1">
        <Routes>
        <Route path="/" element={<HomePage />}/>
        <Route path="/Login" element={<LoginPage />}/>
        <Route path="/Register" element={<RegisterPage />}/>
        <Route path="/Cart" element={<CartPage />}/>
        <Route path="/checkout" element={<CheckoutPage />}/>
        <Route path="/search" element={<SearchResults />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/product/edit/:id" element={<AdminRoute><ProductEdit /></AdminRoute>} />
        <Route path='/order-confirmation' element={<OrderConfirmation/>}/>
        <Route path='users-list' element={<AdminRoute><UserList/></AdminRoute>}/>
        <Route path='product-list' element={<AdminRoute><ProductList/></AdminRoute>}/>
        <Route path='sales-overview' element={<AdminRoute><SalesOverview/></AdminRoute>}/>
        <Route path='/reset-password' element={<ResetPasswordPage/>}/>
        <Route path='/profile' element={<ProfilePage/>}/>
        <Route path='/order-history' element={<OrderHistoryPage/>}/>
        <Route path='/faq' element={<FAQPage/>}/>
        <Route path='/contact' element={<ContactPage/>}/>
        <Route path="*" element={<p>Page not found</p>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
