import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import ReactDOM from "react-dom/client";
import { AuthProvider } from './Components/Functionalities/AuthContext.tsx';

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
)
