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
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [updatingProductId, setUpdatingProductId] = useState<number | null>(null);

    useEffect(() => {
        async function getProducts() {
            if (!user) {
                setLoading(false);
                return;
            }

            const cartId = getCartId();
            setError(null);

            try {
                const response = await fetch(`http://localhost:5231/api/cart/${cartId}`, {
                    credentials: "include"
                });

                if (!response.ok) {
                    setError("Could not load your cart.");
                    return;
                }

            if (!response.ok) {
                console.error("Failed to load cart");
                setError(`Failed to load cart. Status: ${response.status}`);
                return;
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

        const response = await fetch(`http://localhost:5231/api/cart`, {
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
            setError(`Failed to update cart. Status: ${response.status}`);
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

        const response = await fetch(`http://localhost:5231/api/cart/remove`, {
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

        if (!response.ok) {
            setError(`Failed to remove product from cart. Status: ${response.status}`);
            return;
        }

        setProducts(prev =>
            prev.filter(item => item.product.id !== productId)
        );
    }

    return (
        <div className="cart-page-shell">
            <Navbar />
            <div className="cart-page">
                <div className="sidebar">
                </div>
                <div className="results-content">
                    <div className="carts-header">
                        <h1>Shoppingcart</h1>
                    </div>
                    {error && <p className="rounded bg-lightYellow p-3 font-medium">{error}</p>}
                    <div className="cart-actions" style={{ marginBottom: "1rem" }}>
                        {products.length != 0 && (<button className="rounded-lg bg-blue-500 text-white p-1 m-1 mt-3" onClick={goToCheckout}  >
                            Go to checkout
                        </button>)
                        }
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
    )
}
