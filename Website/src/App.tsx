import './App.css';
import './Components/Styling/RetroStyles.css';
import { Routes, Route } from 'react-router-dom';
import { LoginPage } from './Components/Pages/LoginPage';
import { RegisterPage } from "./Components/Pages/RegisterPage";
import { SearchResults } from './Components/Pages/SearchResults';
import { ProductPage } from './Components/Pages/ProductPage';
import { HomePage } from "./Components/Pages/MainPage"
import { useEffect, useState } from "react";
import { getCookie } from "./Components/Functionalities/CookieUtils";
import OrderConfirmation from './Components/Pages/OrderConfirmation';
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
        // Token exists
      }
    }
    // shutting up the annoying error about double rendering which is intentional.
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
    <div className="app-shell">
      <main className="pages">
        <Routes>
        <Route path="/" element={<HomePage />}/>
        <Route path="/Login" element={<LoginPage />}/>
        <Route path="/Register" element={<RegisterPage />}/>
        <Route path="/search" element={<SearchResults />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path='/order-confirmation' element={<OrderConfirmation/>}/>
        <Route path="*" element={<p>Page not found</p>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;