import { useState } from 'react';
import { Link } from 'react-router-dom';
import logoImage from '../../assets/hero.png';
import '../Styling/Navbar.css';

export default function Navbar() {
    const [search, setSearch] = useState("");

    function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
        setSearch(event.currentTarget.value);
    }

    function handleSearchSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        navigate(`/search?query=${encodeURIComponent(search)}`);
    }

    function navigate(path: string) {
        window.location.href = path;
    }
    
    return (
        <div>
            <header className="retro-header">
                <div className="retro-header-content">
                    <Link to="/">
                    <img src={logoImage} alt="ScalpCentral" style={{ height: '50px' }} />
                    </Link>
                    <form onSubmit={handleSearchSubmit}>
                        <input value={search} onChange={handleSearchChange} placeholder="Search products..." />
                    </form>
                    <nav className="retro-nav">
                        <Link to="/" className="retro-nav-link active">HOME</Link>
                        <Link to="/search" className="retro-nav-link">SEARCH</Link>
                        <Link to="/cart" className="retro-nav-link">CART</Link>
                        <Link to="/faq" className="retro-nav-link">FAQ</Link>
                        <Link to="/contact" className="retro-nav-link">CONTACT</Link>
                        <Link to="/login" className="retro-nav-link">LOGIN</Link>
                        <Link to="/register" className="retro-nav-link">REGISTER</Link>
                    </nav>
                </div>
            </header>
        </div>
    )
}
