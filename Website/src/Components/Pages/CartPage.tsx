import '../Styling/CartStyle.css';
import Navbar from '../PageParts/Navbar';
import { useEffect, useState } from "react";
import type { CartItem } from '../Types/CartItem';
import { useNavigate } from "react-router-dom";



export function CartPage() {
    const navigate = useNavigate();
    const [products, setProducts] = useState<CartItem[]>([]);

    useEffect(() => {
        async function GetProducts() {
            let response = await fetch(`http://localhost:5231/api/cart`);
            const data = await response.json();
            setProducts(data);
        }

        GetProducts();

    }, []);

    function goToProduct(id: number) {
        navigate(`/product/${id}`);
    }

    async function updateQuantity(productId: number, newQuantity: number) {
        if (newQuantity < 1) return;

        await fetch(`http://localhost:5231/api/cart`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
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
                            </div>
                        </div>
                    ))}
                    </div>
                </div>
            </div>
        </div>
    )
}