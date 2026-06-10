import '../Styling/CartStyle.css';
import Navbar from '../Utils/Navbar';
import { useEffect, useState } from "react";
import type { CartItem } from '../Types/CartItem';
import { useNavigate } from "react-router-dom";
import { getCartId } from '../Utils/Cart';



export function CartPage() {
    const navigate = useNavigate();
    const [products, setProducts] = useState<CartItem[]>([]);

    useEffect(() => {
        async function GetProducts() {
            const cartId = getCartId();

            const response = await fetch(
                `/api/cart/${cartId}`
            );

            if (!response.ok) {
                console.error("Failed to load cart");
                return;
            }

            const data = await response.json();

            setProducts(Array.isArray(data) ? data : []);
        }

        GetProducts();

    }, []);

    function goToProduct(id: number) {
        navigate(`/product/${id}`);
    }

    function goToCheckout() {
        navigate("/checkout");
    }


    async function updateQuantity(productId: number, newQuantity: number) {
        if (newQuantity < 1) return;

        const cartId = getCartId();

        await fetch(`/api/cart`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                cartId,
                productId,
                quantity: newQuantity
            })
        });

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

        await fetch(`/api/cart/remove`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                cartId,
                productId
            })
        });

        setProducts(prev =>
            prev.filter(item => item.product.id !== productId)
        );
    }

    return (
        <div className="retro-container-search">
            <Navbar />
            <div className="cart-page">
                <div className="sidebar">
                </div>
                <div className="results-content">
                    <div className="carts-header">
                        <h1>Shoppingcart</h1>
                    </div>
                    <div className="cart-actions" style={{ marginBottom: "1rem" }}>
                        <button onClick={goToCheckout} disabled={products.length <= 0}>
                            Go to checkout
                        </button>
                    </div>
                    <div className="cart-content">
                        {products.map(item => (
                        <div key={item.product.id} className="cart-item">
                            <img 
                                src={item.product.images?.[0]} 
                                alt={item.product.name}
                                className="cart-item-image"
                                onClick={() => goToProduct(item.product.id)}
                            />
                            <div className="cart-item-info">
                                <h3 onClick={() => goToProduct(item.product.id)}>
                                    {item.product.name}
                                </h3>
                                <p>€ {item.product.price}</p>
                            </div>
                            <div className="cart-item-quantity">
                                <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                                    -
                                </button>
                                <span>{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                                    +
                                </button>
                                <button className="delete-button" onClick={() => removeFromCart(item.product.id)}>
                                Delete
                                </button>
                            </div>
                        </div>
                    ))}
                    </div>
                </div>
            </div>
        </div>
    )
}