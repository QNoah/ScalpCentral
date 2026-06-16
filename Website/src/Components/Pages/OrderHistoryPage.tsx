import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Utils/Navbar";
import { useAuth } from "../Functionalities/AuthContext";
import "../Styling/OrderHistory.css";

type Order = {
  id: number;
  orderNumber: string;
  email: string;
  price: number;
  country: string;
  city: string;
  postcode: string;
  streetName: string;
  streetNumber: string;
  createdAt: string;
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR"
  }).format(price ?? 0);
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return date.toLocaleDateString("en-GB").replace(/\//g, "-");
}

export default function OrderHistoryPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrders() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:5231/api/order", {
          credentials: "include"
        });

        if (!response.ok) {
          setError("Could not load your orders.");
          setLoading(false);
          return;
        }

        const data = await response.json();
        setOrders(Array.isArray(data) ? data : data.result ?? []);
      } catch {
        setError("Could not connect to the order service.");
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, [user]);

  if (!user) {
    return (
      <div className="order-history-page">
        <Navbar />
        <main className="order-history-empty">
          <section className="order-history-empty-card">
            <p className="order-history-eyebrow">Order history</p>
            <h1>Login required</h1>
            <p>You need to be logged in before you can view your order history.</p>
            <Link className="order-history-primary-button" to="/login">Go to login</Link>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="order-history-page">
      <Navbar />
      <main className="order-history-shell">
        <section className="order-history-header">
          <div>
            <p className="order-history-eyebrow">My orders</p>
            <h1>Order history</h1>
            <p>View the orders linked to your account.</p>
          </div>
          <Link className="order-history-secondary-button" to="/profile">Back to profile</Link>
        </section>

        {loading && <p className="order-history-message">Loading orders...</p>}
        {error && <p className="order-history-error">{error}</p>}

        {!loading && !error && orders.length === 0 && (
          <section className="order-history-empty-state">
            <h2>No orders yet</h2>
            <p>When you place an order, it will show up here.</p>
            <Link className="order-history-primary-button" to="/search">Browse products</Link>
          </section>
        )}

        {!loading && !error && orders.length > 0 && (
          <section className="order-history-list">
            {orders.map(order => (
              <Link className="order-history-card" to={`/order-history/${order.id}`} key={order.id}>
                <div className="order-history-card-main">
                  <span className="order-history-number">{order.orderNumber}</span>
                  <h2>{formatPrice(order.price)}</h2>
                  <p>{formatDate(order.createdAt)}</p>
                </div>

                <div className="order-history-card-details">
                  <div>
                    <span>Email</span>
                    <strong>{order.email}</strong>
                  </div>
                  <div>
                    <span>Shipping</span>
                    <strong>{order.streetName} {order.streetNumber}, {order.postcode} {order.city}</strong>
                  </div>
                  <div>
                    <span>Country</span>
                    <strong>{order.country}</strong>
                  </div>
                </div>
              </Link>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
