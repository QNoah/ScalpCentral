import { Link } from "react-router-dom";
import {
    Button,
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    CardMedia,
    Grid,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import type { Product } from "../../Types/Product.ts";

type ProductResultCardProps = {
    product: Product;
    isLoggedIn: boolean;
    isBookmarked: boolean;
    onBookmark: (product: Product) => void;
    onAddToCart: (product: Product) => void;
};

export function ProductResultCard({
    product,
    isLoggedIn,
    isBookmarked,
    onBookmark,
    onAddToCart,
}: ProductResultCardProps) {
    const productImage = product.images?.[0] ?? "";

    return (
        <Grid size={4} sx={{ height: "530px", padding: "0.25rem" }}>
            <Card sx={{ height: "100%", padding: "0.25rem", position: "relative", display: "flex", flexDirection: "column" }}>
                {isLoggedIn ? (
                    <Button sx={{ alignSelf: "end" }} size="small" onClick={() => onBookmark(product)}>
                        {isBookmarked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    </Button>
                ) : null}

                <CardActionArea component={Link} to={`/product/${product.id}`}>
                    <CardMedia sx={{ height: "300px", backgroundSize: "contain", margin: "0.25rem" }} image={productImage} title={product.name} />

                    <CardContent sx={{ padding: "0.25rem", flex: 1, display: "flex", flexDirection: "column" }}>
                        <h2 className="truncate font-bold text-xl text-lightBlue"> {product.name} </h2>
                        <div className="flex justify-between text-xs">
                            <div>
                                {Array.from({ length: 3 }).map((_, index) => (
                                    <StarIcon
                                        key={index}
                                        sx={{ color: "var(--darkPokeYellow)" }}
                                        fontSize="small"
                                    />
                                ))}
                                <StarHalfIcon sx={{ color: "var(--darkPokeYellow)" }} fontSize="small" />
                                <StarBorderIcon sx={{ color: "var(--darkPokeYellow)" }} fontSize="small" />
                            </div>
                            <p>623 reviews</p>
                        </div>
                        <ul className="flex flex-1 flex-col justify-evenly p-1">
                            <li className="flex justify-between gap-3">
                                <p className="font-bold">Set</p>
                                <p className="text-right">{product.set.name}</p>
                            </li>
                            <li className="flex justify-between gap-3">
                                <p className="font-bold">Series</p>
                                <p className="text-right">{product.set.series}</p>
                            </li>
                            <li className="flex justify-between gap-3">
                                <p className="font-bold">Type</p>
                                <p className="text-right">{product.type}</p>
                            </li>
                        </ul>
                    </CardContent>
                </CardActionArea>

                <CardActions sx={{ justifyContent: "space-between", padding: "0.25rem" }} disableSpacing>
                    <h2>€{product.price.toString()}</h2>
                    <Button size="small" onClick={() => onAddToCart(product)}>
                        <AddShoppingCartIcon />
                    </Button>
                </CardActions>
            </Card>
        </Grid>
    );
}
