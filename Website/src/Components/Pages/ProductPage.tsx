import * as React from 'react';
import {Button, Table, TableHead, TableRow, TableCell, TableBody, Typography, Box, TextField, Popover, Rating} from "@mui/material";
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import Navbar from '../Utils/Navbar.tsx';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Product } from '../Types/Product.ts';
import { getCartId } from '../Utils/Cart.ts';
import { useAuth } from "../Functionalities/AuthContext";

type Review = {
    id: number;
    title: string;
    description: string;
    stars: number;
    createdAt: string;
    firstName: string;
    lastName: string;
};

export function ProductPage() {
    const { user } = useAuth();
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const productId = useParams().id;
    const [reviews, setReviews] = useState<Review[]>([]);
    const [hasReviewedProduct, setHasReviewedProduct] = useState(false);
    const [reviewError, setReviewError] = useState("");
    const [reviewForm, setReviewForm] = useState<{title: string, description: string, stars: number}>({
        title: "",
        description: "",
        stars: 5
    });

    const handleOpenReview = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (!user) {
            navigate("/login");
            return;
        }

        if (!product) {
            setReviewError("Could not find this product. Please reload the page.");
            return;
        }

        if (hasReviewedProduct) {
            return;
        }

        setReviewError("");
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const fetchReviews = React.useCallback(async () => {
        if (!productId) {
            return;
        }

        try {
            const response = await fetch(`/api/review?productId=${productId}`);

            if (!response.ok) {
                setError("Failed to load reviews");
                return;
            }

            const data = await response.json();
            setReviews(Array.isArray(data) ? data : []);
        } catch {
            setError("Failed to load reviews");
        }
    }, [productId]);

    const fetchUserReviewStatus = React.useCallback(async () => {
        if (!productId || !user) {
            setHasReviewedProduct(false);
            return;
        }

        try {
            const response = await fetch(`/api/review?productId=${productId}&userId=${user.id}`);

            if (!response.ok) {
                setHasReviewedProduct(false);
                return;
            }

            const data = await response.json();
            setHasReviewedProduct(Array.isArray(data) && data.length > 0);
        } catch {
            setHasReviewedProduct(false);
        }
    }, [productId, user]);

    useEffect(() => {
        if (productId) {
            const fetchProduct = async () => {
                try {
                    const response = await fetch(`/api/products/${productId}`, {
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

        fetchReviews();
        fetchUserReviewStatus();
    }, [productId, fetchReviews, fetchUserReviewStatus]);

    if (loading) {
        return <div>Loading product...</div>;
    }

    if (!product) {
        return <div>{error || "Product not found"}</div>;
    }

    async function AddToCart(item: Product)
    {
        if (!user) {
            navigate("/login");
            return;
        }

        const cartId = getCartId();

        const response = await fetch("/api/cart/add", {
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

        if (!response.ok) {
            setError("Could not add product to cart");
            return;
        }

        navigate("/cart");
    }

    async function handleSubmitReview() {
        if (!user) {
            navigate("/login");
            return;
        }

        if (!product) {
            setReviewError("Could not find this product. Please reload the page.");
            return;
        }

        if (hasReviewedProduct) {
            setReviewError("You have already reviewed this product.");
            return;
        }

        if (reviewForm.stars < 0.5 || reviewForm.stars > 5) {
            setReviewError("Choose a rating between 0.5 and 5 stars.");
            return;
        }

        const response = await fetch(`/api/review`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                UserId: user.id,
                ProductId: product.id,
                Title: reviewForm.title,
                Description: reviewForm.description,
                Stars: reviewForm.stars
            })
        });

        if (!response.ok) {
            setReviewError("Could not submit your review. Please try again.");
            return;
        }

        await fetchReviews();
        setHasReviewedProduct(true);
        setReviewForm({ title: "", description: "", stars: 5 });
        handleClose();
    }

    function renderStars(stars: number) {
        return Array.from({ length: 5 }).map((_, index) => {
            const starValue = index + 1;

            if (stars >= starValue) {
                return <StarIcon key={index} sx={{ color: "var(--darkPokeYellow)" }} fontSize="small" />;
            }

            if (stars >= starValue - 0.5) {
                return <StarHalfIcon key={index} sx={{ color: "var(--darkPokeYellow)" }} fontSize="small" />;
            }

            return <StarBorderIcon key={index} sx={{ color: "var(--darkPokeYellow)" }} fontSize="small" />;
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
                        <p>Reviews: {reviews.length}</p>
                        <img className="max-h-[600px] object-contain" src={product?.images[0]} alt={product.name} />
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
                                maxHeight:"34px",
                                border: "1px solid var(--retro-border)",
                                "&:disabled": {
                                    backgroundColor: "var(--retro-surface)",
                                    color: "var(--retro-text-muted)"
                                }
                                }} variant="contained" onClick={handleOpenReview} disableElevation disabled={hasReviewedProduct}>
                            {hasReviewedProduct ? "Review Already Written" : "Write A Review"}
                        </Button>
                        <Popover
                            id={id}
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            slotProps={{
                                paper: {
                                    sx: {
                                        borderRadius: 2,
                                        border: "1px solid var(--retro-border)",
                                        boxShadow: "0 14px 40px rgba(0, 25, 89, 0.16)",
                                        backgroundColor: "var(--pokeWhite)"
                                    }
                                }
                            }}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "left"
                            }}
                        >
                            <Box sx={{ p: 2.5, display: "flex", flexDirection: "column", gap: 2, width: 340 }}>
                                <Box>
                                    <Typography variant="h6" sx={{ color: "var(--darkPokeBlue)", fontWeight: 700 }}>
                                        Write a Review
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: "var(--retro-text-muted)" }}>
                                        Share your experience with this product.
                                    </Typography>
                                </Box>

                                <TextField
                                    label="Title"
                                    size="small"
                                    value={reviewForm.title}
                                    onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                                />

                                <TextField
                                    label="Description"
                                    multiline
                                    rows={3}
                                    size="small"
                                    value={reviewForm.description}
                                    onChange={(e) => setReviewForm({ ...reviewForm, description: e.target.value })}
                                />

                                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                                    <Typography variant="body2" sx={{ color: "var(--darkPokeBlue)", fontWeight: 600 }}>
                                        Rating
                                    </Typography>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <Rating
                                            value={reviewForm.stars}
                                            precision={0.5}
                                            onChange={(_, value) => setReviewForm({ ...reviewForm, stars: value ?? 0 })}
                                            sx={{ color: "var(--darkPokeYellow)" }}
                                        />
                                        <Typography variant="body2" sx={{ color: "var(--retro-text-muted)", minWidth: 28 }}>
                                            {reviewForm.stars.toFixed(1)}
                                        </Typography>
                                    </Box>
                                </Box>

                                {reviewError ? (
                                    <Typography variant="body2" color="error">
                                        {reviewError}
                                    </Typography>
                                ) : null}

                                <Button
                                    variant="contained"
                                    onClick={handleSubmitReview}
                                    disableElevation
                                    sx={{
                                        backgroundColor: "var(--pokeYellow)",
                                        color: "black",
                                        fontWeight: 700,
                                        "&:hover": {
                                            backgroundColor: "var(--darkPokeYellow)"
                                        }
                                    }}
                                >
                                    Submit
                                </Button>
                            </Box>
                        </Popover>
                        <h2>Description</h2>
                        <p dangerouslySetInnerHTML={{__html:product.description}}></p>
                    </div>
                </section>
            </section>
            <section id="reviews-section" className="flex flex-col max-w-screen-2xl flex-1 self-center w-full p-1">
                <h2 className="text-center text-darkBlue">Reviews</h2>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mt: 1 }}>
                    {reviews.map((review) => (
                        <Box
                            key={review.id}
                            sx={{
                                p: 2,
                                border: "1px solid var(--retro-border)",
                                borderRadius: 2,
                                backgroundColor: "var(--pokeWhite)",
                                display: "flex",
                                flexDirection: "column",
                                gap: 1,
                                boxShadow: "0 6px 18px rgba(0, 25, 89, 0.06)"
                            }}
                        >
                            <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
                                <Typography variant="subtitle2" sx={{ color: "var(--darkPokeBlue)", fontWeight: 700 }}>
                                    {review.firstName} {review.lastName}
                                </Typography>
                                <Typography variant="caption" sx={{ color: "var(--retro-text-muted)" }}>
                                    {review.createdAt ? new Date(review.createdAt).toLocaleDateString("nl-NL") : ""}
                                </Typography>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                    {review.title}
                                </Typography>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
                                    {renderStars(review.stars)}
                                    <Typography variant="caption" sx={{ ml: 0.5, color: "var(--retro-text-muted)" }}>
                                        {review.stars.toFixed(1)}
                                    </Typography>
                                </Box>
                            </Box>
                            <Typography variant="body2" color="text.secondary">{review.description}</Typography>
                        </Box>
                    ))}
                </Box>
            </section>
        </main>
    );
}
