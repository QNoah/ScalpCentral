import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../Functionalities/AuthContext";
import logoImage from "../../assets/imgs/NameOnly.png";
import logoIcon from "../../assets/imgs/Symbol.png";
import "../Styling/Navbar.css";

export default function Navbar() {
  const { user, setUser } = useAuth();
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

  function logout() {
  setUser(null);
}

  return (
    <main className="flex h-16 w-screen sticky justify-center" style={{background: "linear-gradient(to top, #00478A, #6F97FF)"}}>
      <div className="flex flex-1 justify-evenly max-w-screen-2xl">
        <NavLink to="/" className="flex items-center">
          <picture>
              <source media="(max-width: 1100px)" srcSet={logoIcon} />
              <img
                  src={logoImage}
                  alt="ScalpCentral"
                  className="min-h-10 min-w-32 max-h-16 object-cover"
              />
          </picture>
        </NavLink>
        <form className="flex items-center flex-1 max-w-[300px]" onSubmit={handleSearchSubmit}>
          <input
            className="flex-1 rounded-xl p-1 pl-4 bg-offWhite"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search products..."
          />
        </form>
        <nav className="flex flex-1 max-w-[768px] justify-between items-center">
          <NavLink to="/" className="navbar-link">
            HOME
          </NavLink>
          <NavLink to="/search" className="navbar-link">
            SEARCH
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
           {user ? (
              <>
                <button
                  className="navbar-link"
                  onClick={() => {
                    localStorage.removeItem("token");
                    setUser(null)
                    window.location.reload();
                  }}
                >
                  LOGOUT
                </button>

                <NavLink to="/profile" className="navbar-link">
                  PROFILE
                </NavLink>
              </>
            ) : (
              <>
                <NavLink to="/login" className="navbar-link">
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
