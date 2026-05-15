import { useState } from "react";
import { Link } from "react-router-dom";
import logoImage from "../../assets/imgs/NameOnly.png";
import "../Styling/Navbar.css";

export default function Navbar() {
  const [search, setSearch] = useState("");

  function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearch(event.currentTarget.value);
  }

  function handleSearchSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    navigate(`/search?name=${encodeURIComponent(search)}`);
  }

  function navigate(path: string) {
    window.location.href = path;
  }

  return (
    <div>
      <header className="navbar">
        <div className="navbar-content">
          <Link to="/" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <img
              src={logoImage}
              alt="ScalpCentral"
              className="h-10 w-auto"
            />
          </Link>
          <form className="navbar-search" onSubmit={handleSearchSubmit}>
            <input
              value={search}
              onChange={handleSearchChange}
              placeholder="Search products..."
            />
          </form>
          <nav className="navbar-links">
            <Link to="/" className="navbar-link">
              HOME
            </Link>
            <Link to="/search" className="navbar-link">
              SEARCH
            </Link>
            <Link to="/cart" className="navbar-link">
              CART
            </Link>
            <Link to="/faq" className="navbar-link">
              FAQ
            </Link>
            <Link to="/contact" className="navbar-link">
              CONTACT
            </Link>
            <Link to="/login" className="navbar-link">
              LOGIN
            </Link>
            <Link to="/register" className="navbar-link">
              REGISTER
            </Link>
          </nav>
        </div>
      </header>
    </div>
  );
}
