import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../Utils/Navbar";
import { useAuth } from "../Functionalities/AuthContext";
import "../Styling/OrderHistory.css";

type Order = {
  id: number;
  orderNumber: string;
  email: string;
  phoneNumber?: string;
  price: number;
  country: string;
  city: string;
  postcode: string;
  streetName: string;
  streetNumber: string;
  createdAt: string;
};

type OrderItem = {
  productId: number;
  productName: string;
  unitPrice: number;
  amount: number;
};

type OrderInfo = {
  order: Order;
  items: OrderItem[];
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

export default function OrderDetailPage() {
  const { user } = useAuth();
  const { id } = useParams();
  const [orderInfo, setOrderInfo] = useState<OrderInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrder() {
      if (!user || !id) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5231/api/order/${id}/details`, {
          credentials: "include"
        });

        if (!response.ok) {
          setError("Could not load this order.");
          setLoading(false);
          return;
        }

        setOrderInfo(await response.json());
      } catch {
        setError("Could not connect to the order service.");
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  }, [id, user]);

  if (!user) {
    return (
      <div className="order-history-page">
        <Navbar />
        <main className="order-history-empty">
          <section className="order-history-empty-card">
            <p className="order-history-eyebrow">Order details</p>
            <h1>Login required</h1>
            <p>You need to be logged in before you can view an order.</p>
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
            <p className="order-history-eyebrow">Order details</p>
            <h1>{orderInfo?.order.orderNumber ?? "Order"}</h1>
            <p>{orderInfo ? formatDate(orderInfo.order.createdAt) : "Loading order..."}</p>
          </div>
          <Link className="order-history-secondary-button" to="/order-history">Back to orders</Link>
        </section>

        {loading && <p className="order-history-message">Loading order...</p>}
        {error && <p className="order-history-error">{error}</p>}

        {!loading && !error && orderInfo && (
          <section className="order-detail-grid">
            <article className="order-history-card order-detail-card">
              <div className="order-history-card-main">
                <span className="order-history-number">{orderInfo.order.orderNumber}</span>
                <h2>{formatPrice(orderInfo.order.price)}</h2>
                <p>{orderInfo.items.length} product line{orderInfo.items.length === 1 ? "" : "s"}</p>
              </div>
              <div className="order-history-card-details">
                <div>
                  <span>Email</span>
                  <strong>{orderInfo.order.email}</strong>
                </div>
                <div>
                  <span>Phone</span>
                  <strong>{orderInfo.order.phoneNumber || "Not set"}</strong>
                </div>
                <div>
                  <span>Shipping address</span>
                  <strong>{orderInfo.order.streetName} {orderInfo.order.streetNumber}, {orderInfo.order.postcode} {orderInfo.order.city}, {orderInfo.order.country}</strong>
                </div>
              </div>
            </article>

            <article className="order-detail-products">
              <h2>Products</h2>
              <div className="order-detail-product-list">
                {orderInfo.items.length === 0 && (
                  <p className="order-history-message">No product lines were saved for this order.</p>
                )}

                {orderInfo.items.map(item => (
                  <Link className="order-detail-product-row" to={`/product/${item.productId}`} key={item.productId}>
                    <div>
                      <strong>{item.productName}</strong>
                      <span>Quantity: {item.amount}</span>
                    </div>
                    <div>
                      <span>{formatPrice(item.unitPrice)} each</span>
                      <strong>{formatPrice(item.unitPrice * item.amount)}</strong>
                    </div>
                  </Link>
                ))}
              </div>
            </article>
          </section>
        )}
      </main>
    </div>
  );
}
