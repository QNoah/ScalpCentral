import '../Styling/Product.css';
import Navbar from '../PageParts/Navbar';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { Product } from '../Types/Product.ts';

export function ProductPage() {
    const [product, setProduct] = useState<Product | null>(null);
    const [reviews, setReviews] = useState<[]>([]); // Replace 'any' with your review type
    const productId = useParams().id;

    useEffect(() => {
        if (productId) {
            const fetchProduct = async () => {
                const response = await fetch(`http://localhost:5231/api/products/${productId}`);
                const data = await response.json();
                setProduct(data);
            };
            fetchProduct();
        }
    }, [productId]);

    if (!product) {
        return <div>Product not found</div>;
    }

    return (
        <main className="product-page">
            <Navbar />
            <div className="product-container">
                <div className="product-header">
                    <button onClick={() => window.history.back()}>Return to Search Results</button>
                </div>
                <div className="product-content">
                    <div className="product-card">
                        <button className="product-card-bookmark-button">HEART ICON</button>
                        <h2>{product?.name}</h2>
                        <p>reviews: {reviews.length}</p>
                        <img className="product-image" src={product?.images[0]} alt={product?.name} />
                        <div className="product-specifications">
                            <h3 style={{}}>Specifications</h3>
                            <table>
                                <tr>
                                    <th>Type</th>
                                    <th>Set</th>
                                    <th>Series</th>
                                </tr>
                                <tr>
                                    <td>{product?.type}</td>
                                    <td>{product?.set.name}</td>
                                    <td>{product?.set.series}</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div className="product-details">
                        <div className="purchase-section">
                            <p className='product-price'>€{product?.price}</p>
                            <button className="add-to-cart-button">Add to Cart</button>
                        </div>
                        <h2>Description</h2>
                        <p dangerouslySetInnerHTML={{__html:product.description}}></p>
                    </div>
                </div>
            </div>
        </main>
    );
}