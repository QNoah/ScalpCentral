import './App.css';
import { Routes, Route } from 'react-router-dom';
import { RegisterPage, LoginPage } from "./Components/Pages/AuthPages";
import { SearchResults } from './Components/Pages/SearchResults';
import { ProductPage } from './Components/Pages/ProductPage';
import { HomePage } from "./Components/Pages/MainPage"
import { useEffect, useState } from "react";
import { getCookie } from "./Components/Functionalities/CookieUtils";
import OrderConfirmation from './Components/Pages/OrderConfirmation';
import ProductList from './Components/Pages/Admin/ProductList';
import { CartPage } from './Components/Pages/CartPage';
import Footer from './Components/PageParts/Footer';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getCookie("authToken");
    if (token) {
      localStorage.setItem("authToken", token);
    } else {
      const storedToken = localStorage.getItem("authToken");
      if (storedToken) {
      }
    }
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
        <Route path="/search" element={<SearchResults />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path='/order-confirmation' element={<OrderConfirmation/>}/>
        <Route path='product-list' element={<ProductList/>}/>
        <Route path="*" element={<p>Page not found</p>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;