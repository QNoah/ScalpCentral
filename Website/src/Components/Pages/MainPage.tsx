import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Utils/Navbar";
import type { Product } from "../Types/Product";
import "../Styling/Home.css";

function formatPrice(price: number) {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR"
  }).format(price ?? 0);
}

export function HomePage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch("/api/products/paged?page=0", {
          headers: {
            limit: "8"
          },
          credentials: "include"
        });

        if (!response.ok) {
          setLoading(false);
          return;
        }

        const data = await response.json();
        setProducts(Array.isArray(data.result) ? data.result : []);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    navigate(`/search?name=${encodeURIComponent(search)}`);
  }

  return (
    <div className="home-page">
      <Navbar />
      <main>
        <section className="home-hero">
          <div className="home-hero-content">
            <div className="home-hero-copy">
              <p className="home-eyebrow">ScalpCentral shop</p>
              <h1>Sealed Pokemon products for collectors.</h1>
              <p>Shop booster packs, boxes, tins and special collections from the current product catalogue.</p>

              <form className="home-search" onSubmit={submitSearch}>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search booster box, tin, collection..." />
                <button type="submit">Search</button>
              </form>
            </div>

            <div className="home-hero-cards" aria-label="Shop categories">
              <div>
                <strong>Booster packs</strong>
                <span>Classic packs and sealed boosters.</span>
              </div>
              <div>
                <strong>Elite trainer boxes</strong>
                <span>Boxes, bundles and collector products.</span>
              </div>
              <div>
                <strong>Tins & collections</strong>
                <span>Special releases from the catalogue.</span>
              </div>
            </div>
          </div>
        </section>

        <section className="home-section">
          <div className="home-section-header">
            <div>
              <p className="home-eyebrow">Shop</p>
              <h2>Featured products</h2>
            </div>
            <Link to="/search">View all products</Link>
          </div>

          {loading && <p className="home-message">Loading products...</p>}

          {!loading && products.length === 0 && (
            <p className="home-message">No products found. Try loading the database seed first.</p>
          )}

          <div className="home-product-grid">
            {products.map(product => (
              <Link className="home-product-card" to={`/product/${product.id}`} key={product.id}>
                <div className="home-product-image">
                  <img src={product.images?.[0]} alt={product.name} />
                </div>
                <div className="home-product-info">
                  <strong>{product.name}</strong>
                  <span>{product.set?.name}</span>
                  <p>{formatPrice(product.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
