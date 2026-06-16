import { Link } from "react-router-dom";
import Navbar from "../Utils/Navbar";
import "../Styling/Marketplace.css";

export function MarketplacePage() {
  return (
    <div className="marketplace-page">
      <Navbar />
      <main className="marketplace-shell">
        <section className="marketplace-panel">
          <p className="marketplace-eyebrow">Coming soon</p>
          <h1>Marketplace for singles and trading</h1>
          <p>
            This part will be for individual cards, user listings and trading features.
            For now, ScalpCentral focuses on sealed shop products like boosters, tins and collections.
          </p>
          <Link className="marketplace-button" to="/search">Back to shop</Link>
        </section>
      </main>
    </div>
  );
}
