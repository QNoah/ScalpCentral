import {Button, Table, TableHead, TableRow, TableCell, TableBody} from "@mui/material";
import Navbar from '../Utils/Navbar.tsx';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { Product } from '../Types/Product.ts';
import { getCartId } from '../Utils/Cart.ts';

export function ProductPage() {
    const [product, setProduct] = useState<Product | null>(null);
    const [reviews, setReviews] = useState<[]>([]); // Replace 'any' with your review type
    const productId = useParams().id;

    useEffect(() => {
        if (productId) {
            const fetchProduct = async () => {
                const response = await fetch(`http://localhost:5231/api/products/${productId}`, {
                    credentials: "include"
                });
                const data = await response.json();
                setProduct(data);
            };
            fetchProduct();
        }
    }, [productId]);

    if (!product) {
        return <div>Product not found</div>;
    }

    async function AddToCart(item: Product)
    {
        const cartId = getCartId();

        await fetch("http://localhost:5231/api/cart/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                cartId,
                productId: item.id,
                quantity: 1
            })
        });
    }

    return (
        <main className="flex flex-col min-h-screen bg-white">
            <Navbar />
            <section id="product-section" className="flex flex-col max-w-screen-xl flex-1 self-center w-full p-1">
                <nav className="flex justify-start p-1">
                    <Button onClick={() => window.history.back()}>Return to Search Results</Button>
                </nav>
                <section id="product-details" className="flex justify-between flex-1 w-full gap-9 p-1">
                    <div id="product-card" className="flex flex-col justify-between flex-1 gap-1 p-1">
                        <h2 className="text-left">{product.name}</h2>
                        <p>STARS: ***** review: 666</p>
                        <img className="max-h-[600px] object-contain" src={product?.images[0]} alt="It looks cool I promise <3" />
                        <h2>Specifications</h2>
                        <Table size="small" sx={{width: '100%', borderCollapse: 'collapse', backgroundColor: "var(--pokeWhite)"}}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Type</TableCell>
                                    <TableCell>Set</TableCell>
                                    <TableCell>Series</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            <TableRow>
                                <TableCell>{product?.type}</TableCell>
                                <TableCell>{product?.set.name}</TableCell>
                                <TableCell>{product?.set.series}</TableCell>
                            </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                    <div id="product-utility" className="flex flex-col gap-1 flex-1 max-w-[30rem] p-1">
                        <div className="flex justify-between gap-8 p-1">
                            <h1 className="">€{product?.price}</h1>
                            <Button sx={{
                                backgroundColor: "#F1F979", 
                                color: "black",
                                flex: 1
                                }} variant="contained" onClick={() => AddToCart(product)} disableElevation>Add to Cart</Button>
                        </div>
                        <h2>Description</h2>
                        <p dangerouslySetInnerHTML={{__html:product.description}}></p>
                    </div>
                </section>
            </section>
            <section id="reviews-section" className="flex flex-col max-w-screen-2xl flex-1 self-center w-full p-1">
                <h2 className="text-center">Reviews</h2>
                {/* VERVANG MET DAADWERKELIJKE REVIEWS WANNEER API WERKT */}
            </section>
        </main>
    );
}