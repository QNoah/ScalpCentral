import * as React from 'react';
import {Button, Table, TableHead, TableRow, TableCell, TableBody, Typography, Box, TextField, Popover} from "@mui/material";
import Navbar from '../Utils/Navbar.tsx';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Product } from '../Types/Product.ts';
import { getCartId } from '../Utils/Cart.ts';
import { useAuth } from "../Functionalities/AuthContext";

export function ProductPage() {
    const { user } = useAuth();
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const productId = useParams().id;
    const [reviews, setReviews] = useState<{id: number, title: string, description: string, stars: number, createdAt: string, firstName: string, lastName: string}[]>([])
    const [reviewForm, setReviewForm] = useState<{title: string, description: string, stars: number}>({
        title: "",
        description: "",
        stars: 0
    })

    const handleOpenReview = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    useEffect(() => {
        if (productId) {
            const fetchProduct = async () => {
                try {
                    const response = await fetch(`http://localhost:5231/api/products/${productId}`, {
                      credentials: "include"
                    });

                    if (!response.ok) {
                        setError("Product not found");
                        return;
                    }

                    const data = await response.json();
                    setProduct(data);
                } catch {
                    setError("Failed to load product");
                } finally {
                    setLoading(false);
                }
            };
            fetchProduct();
        }

        async function fetchReviews()
        {
            if (productId) {
                try {
                        const response = await fetch(`http://localhost:5231/api/review?productId=${productId}`);
                        const data = await response.json();
                        setReviews(Array.isArray(data) ? data : []);
                } catch {
                    setError("Failed to load reviews");
                }
            }
        }

        fetchReviews();
    }, [productId]);

    if (loading) {
        return <div>Loading product...</div>;
    }

    if (!product) {
        return <div>{error || "Product not found"}</div>;
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

        navigate("/checkout");
    }

    async function handleSubmitReview() {
        await fetch(`http://localhost:5231/api/review`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                UserId: user?.id,
                ProductId: product?.id,
                Title: reviewForm.title,
                Description: reviewForm.description,
                Stars: reviewForm.stars
            })
        })
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
                        <p>Reviews: {reviews.length}</p>
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
                        <Button sx={{
                                backgroundColor: "#EAFFC8", 
                                color: "black",
                                flex: 1,
                                maxHeight:"30px"
                                }} variant="contained" onClick={handleOpenReview} disableElevation>Write A Review</Button>
                        <Popover
                            id={id}
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "left"
                            }}
                        >
                            <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2, width: 300 }}>
                                <Typography variant="h6">Write a Review</Typography>

                                <TextField
                                    label="Title"
                                    value={reviewForm.title}
                                    onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                                />

                                <TextField
                                    label="Description"
                                    multiline
                                    rows={3}
                                    value={reviewForm.description}
                                    onChange={(e) => setReviewForm({ ...reviewForm, description: e.target.value })}
                                />

                                <TextField
                                    label="Stars (1-5)"
                                    type="number"
                                    slotProps={{ htmlInput: { min: 1, max: 5 } }}
                                    value={reviewForm.stars}
                                    onChange={(e) => setReviewForm({ ...reviewForm, stars: parseFloat(e.target.value) })}
                                />

                                <Button variant="contained" onClick={handleSubmitReview}>Submit</Button>
                            </Box>
                        </Popover>
                        <h2>Description</h2>
                        <p dangerouslySetInnerHTML={{__html:product.description}}></p>
                    </div>
                </section>
            </section>
            <section id="reviews-section" className="flex flex-col max-w-screen-2xl flex-1 self-center w-full p-1">
                <h2 className="text-center">Reviews</h2>
                {reviews.map((review, index) => (
                    <Box key={index} sx={{ p: 1.5, borderBottom: "1px solid #eee", display: "flex", flexDirection: "column", gap: 0.5 }}>
                        <div className='flex flex-1 justify-between'>
                                <h3>{review.firstName} {review.lastName}</h3>
                                <h3>{review.createdAt}</h3>
                            </div>
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography variant="subtitle2">{review.title}</Typography>
                            <Typography variant="caption">{"⭐".repeat(review.stars)}</Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">{review.description}</Typography>
                    </Box>
                ))}
            </section>
        </main>
    );
}