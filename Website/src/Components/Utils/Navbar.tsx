import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../Functionalities/AuthContext";
import logoImage from "../../assets/imgs/NameOnly.png";
import logoIcon from "../../assets/imgs/Symbol.png";
import "../Styling/Navbar.css";

export default function Navbar() {
  const { user } = useAuth();
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
    <main className="navbar-shell">
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-brand">
          <picture>
              <source media="(max-width: 1100px)" srcSet={logoIcon} />
              <img
                  src={logoImage}
                  alt="ScalpCentral"
                  className="min-h-10 min-w-32 max-h-16 object-cover"
              />
          </picture>
        </NavLink>
        <form className="navbar-search" onSubmit={handleSearchSubmit}>
          <input
            value={search}
            onChange={handleSearchChange}
            placeholder="Search products..."
          />
        </form>
        <nav className="navbar-links">
          <NavLink to="/search" className="navbar-link">
            SHOP
          </NavLink>
          <NavLink to="/marketplace" className="navbar-link">
            MARKETPLACE
          </NavLink>
          <NavLink to="/cart" className="navbar-link">
            CART
          </NavLink>
          <NavLink to="/faq" className="navbar-link">
            FAQ
          </NavLink>
          <NavLink to="/contact" className="navbar-link">
            CONTACT
          </NavLink>
          {user?.role === "Admin" && (
            <>
              <NavLink to="/product-list" className="navbar-link">
                PRODUCTS
              </NavLink>
              <NavLink to="/users-list" className="navbar-link">
                USERS
              </NavLink>
              <NavLink to="/sales-overview" className="navbar-link">
                SALES
              </NavLink>
            </>
          )}
           {user ? (
              <>
                <NavLink to="/profile" className="navbar-link navbar-account-link">
                  PROFILE
                </NavLink>
              </>
            ) : (
              <>
                <NavLink to="/login" className="navbar-link navbar-account-link">
                  LOGIN
                </NavLink>

                <NavLink to="/register" className="navbar-link">
                  REGISTER
                </NavLink>
              </>
            )}
        </nav>
      </div>
    </main>
  );
}
