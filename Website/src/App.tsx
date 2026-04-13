import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './Components/Pages/LoginPage';
import RegisterPage from "./Components/Pages/RegisterPage";
import MainPage from "./Components/Pages/MainPage"
import { useEffect, useState } from "react";
import { getCookie } from "./Components/Functionalities/CookieUtils";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = getCookie("authToken");
    if (token) {
      localStorage.setItem("authToken", token);
      setIsAuthenticated(true);
    } else {
      const storedToken = localStorage.getItem("authToken");
      if (storedToken) {
        setIsAuthenticated(true);
      }
    }
    setIsLoading(false);
  }, []);

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <main className="pages">
        <Routes>
          <Route path="/" element={isAuthenticated ? <Navigate to="/Main" /> : <LoginPage setIsAuthenticated={setIsAuthenticated} />}/>
          <Route path="/Main" element={isAuthenticated ? <MainPage setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/" />}/>
          <Route path="/Login" element={isAuthenticated ? <LoginPage setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/" />}/>
          <Route path="/Register" element={<RegisterPage />}/>
          <Route path="*" element={<p>Page not found</p>} />
        </Routes>
      </main>
    </>
  );
}

export default App;