import './App.css';
import './Components/Styling/RetroStyles.css';
import { Routes, Route } from 'react-router-dom';
import { LoginPage } from './Components/Pages/LoginPage';
import { RegisterPage } from "./Components/Pages/RegisterPage";
import { HomePage } from "./Components/Pages/MainPage"
import { useEffect, useState } from "react";
import { getCookie } from "./Components/Functionalities/CookieUtils";

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
    setIsLoading(false);
  }, []);

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <main className="pages">
        <Routes>
          <Route path="/" element={<HomePage />}/>
          <Route path="/Login" element={<LoginPage />}/>
          <Route path="/Register" element={<RegisterPage />}/>
          <Route path="*" element={<p>Page not found</p>} />
        </Routes>
      </main>
    </>
  );
}

export default App;