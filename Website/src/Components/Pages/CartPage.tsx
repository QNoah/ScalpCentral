import "../Styling/CartStyle.css";
import Navbar from "../Utils/Navbar";
import { useEffect, useState } from "react";
import type { CartItem } from "../Types/CartItem";
import { Link, useNavigate } from "react-router-dom";
import { getCartId } from "../Utils/Cart";
import { useAuth } from "../Functionalities/AuthContext";

function formatPrice(price: number) {
    return new Intl.NumberFormat("nl-NL", {
        style: "currency",
        currency: "EUR"
    }).format(price ?? 0);
}

export function CartPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [products, setProducts] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingProductId, setUpdatingProductId] = useState<number | null>(null);

    useEffect(() => {
        async function getProducts() {
            if (!user) {
                setLoading(false);
                return;
            }

            const cartId = getCartId();

            try {
                const response = await fetch(`http://localhost:5231/api/cart/${cartId}`, {
                    credentials: "include"
                });

                if (!response.ok) {
                    setError("Could not load your cart.");
                    return;
                }

                const data = await response.json();
                setProducts(Array.isArray(data) ? data : []);
            } catch {
                setError("Could not connect to the cart service.");
            } finally {
                setLoading(false);
            }
        }

        getProducts();
    }, [user]);

    function getTotal() {
        return products.reduce((total, item) => total + item.product.price * item.quantity, 0);
    }

    function getItemCount() {
        return products.reduce((total, item) => total + item.quantity, 0);
    }

    async function updateQuantity(productId: number, newQuantity: number) {
        if (newQuantity < 1) return;

        const cartId = getCartId();
        setUpdatingProductId(productId);
        setError("");

        const response = await fetch("http://localhost:5231/api/cart", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                cartId,
                productId,
                quantity: newQuantity
            })
        });

        setUpdatingProductId(null);
        if (!response.ok) {
            setError("Could not update quantity.");
            return;
        }

        setProducts(prev =>
            prev.map(item =>
                item.product.id === productId
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
    }

    async function removeFromCart(productId: number) {
        const cartId = getCartId();
        setUpdatingProductId(productId);
        setError("");

        const response = await fetch("http://localhost:5231/api/cart/remove", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                cartId,
                productId
            })
        });

        setUpdatingProductId(null);
        if (!response.ok) {
            setError("Could not remove product.");
            return;
        }

        setProducts(prev => prev.filter(item => item.product.id !== productId));
    }

    if (!user) {
        return (
            <div className="cart-page-shell">
                <Navbar />
                <main className="cart-empty-state">
                    <section>
                        <p className="cart-eyebrow">Shopping cart</p>
                        <h1>Login required</h1>
                        <p>Please login before viewing your shopping cart.</p>
                        <Link className="cart-primary-button" to="/login">Go to login</Link>
                    </section>
                </main>
            </div>
        );
    }

    return (
        <div className="cart-page-shell">
            <Navbar />
            <main className="cart-layout">
                <section className="cart-main">
                    <div className="cart-header">
                        <div>
                            <p className="cart-eyebrow">Shopping cart</p>
                            <h1>Your cart</h1>
                            <p>{getItemCount()} item{getItemCount() === 1 ? "" : "s"} ready for checkout.</p>
                        </div>
                        <Link className="cart-secondary-button" to="/search">Continue shopping</Link>
                    </div>

                    {loading && <p className="cart-message">Loading cart...</p>}
                    {error && <p className="cart-error">{error}</p>}

                    {!loading && products.length === 0 && (
                        <section className="cart-empty-state cart-empty-inline">
                            <h2>Your cart is empty</h2>
                            <p>Browse products and add cards before checkout.</p>
                            <Link className="cart-primary-button" to="/search">Browse products</Link>
                        </section>
                    )}

                    {!loading && products.length > 0 && (
                        <div className="cart-list">
                            {products.map(item => (
                                <article key={item.product.id} className="cart-item-card">
                                    <button className="cart-image-button" type="button" onClick={() => navigate(`/product/${item.product.id}`)}>
                                        <img src={item.product.images?.[0]} alt={item.product.name} />
                                    </button>

                                    <div className="cart-item-info">
                                        <button type="button" onClick={() => navigate(`/product/${item.product.id}`)}>
                                            {item.product.name}
                                        </button>
                                        <span>{item.product.type}</span>
                                        <strong>{formatPrice(item.product.price)}</strong>
                                    </div>

                                    <div className="cart-item-controls">
                                        <div className="cart-quantity">
                                            <button type="button" disabled={updatingProductId === item.product.id || item.quantity <= 1} onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>-</button>
                                            <span>{item.quantity}</span>
                                            <button type="button" disabled={updatingProductId === item.product.id} onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>+</button>
                                        </div>
                                        <p>{formatPrice(item.product.price * item.quantity)}</p>
                                        <button className="cart-remove-button" type="button" disabled={updatingProductId === item.product.id} onClick={() => removeFromCart(item.product.id)}>
                                            Remove
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>

                <aside className="cart-summary">
                    <h2>Order summary</h2>
                    <div className="cart-summary-row">
                        <span>Items</span>
                        <strong>{getItemCount()}</strong>
                    </div>
                    <div className="cart-summary-row">
                        <span>Total</span>
                        <strong>{formatPrice(getTotal())}</strong>
                    </div>
                    <button className="cart-checkout-button" type="button" disabled={products.length === 0} onClick={() => navigate("/checkout")}>
                        Go to checkout
                    </button>
                </aside>
            </main>
        </div>
    );
}
