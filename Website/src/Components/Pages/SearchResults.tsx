import '../Styling/Search.css';
import Navbar from '../Utils/Navbar.tsx';
import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import type { Product } from '../Types/Product.ts';
import { Grid, Pagination, Card, CardMedia, CardHeader, CardContent, CardActions, Checkbox, List, ListItem, ListItemButton, Button, CardActionArea } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import StarIcon from '@mui/icons-material/Star';
import { getCartId } from '../Utils/Cart.ts';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarHalfIcon from '@mui/icons-material/StarHalf';

export function SearchResults() {
    const PAGE_SIZE = 24;
    const [page, setPage] = useState<number>(0);
    const [totalCount, setTotalCount] = useState<number>(0);

    const [searchParams, setSearchParams] = useSearchParams();
    const [searchResults, setSearchResults] = useState<Product[]>([]);

    const [types, setTypes] = useState<string[]>([]);
    const [sets, setSets] = useState<string[]>([]);
    const [series, setSeries] = useState<string[]>([]);

    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [selectedSets, setSelectedSets] = useState<string[]>([]);
    const [selectedSeries, setSelectedSeries] = useState<string[]>([]);
    const [minPrice, setMinPrice] = useState<number | null>(null);
    const [maxPrice, setMaxPrice] = useState<number | null>(null);
    const [inStock, setInStock] = useState<boolean>(false);
    const [onSale, setOnSale] = useState<boolean>(false);
    const [sortOption, setSortOption] = useState<string>("default");

    useEffect(() => {
        async function fetchSearchResults() {
            let response = await fetch(`http://localhost:5231/api/products/paged?${searchParams.toString()}`, {
                method: "GET",
                headers: {
                    "limit": PAGE_SIZE.toString()
                }
            });
            let data = await response.json();
            setSearchResults(data.result);
            setTotalCount(data.totalCount);

            if (!searchParams || searchParams.size === 0 || (searchParams.size === 1 && searchParams.has("name"))) {
                response = await fetch(`http://localhost:5231/api/products/filters?${searchParams.toString()}`);
                data = await response.json();
                
                setTypes(data.types);
                setSets(data.sets);
                setSeries(data.series);
            }
        };

        fetchSearchResults();
    }, [searchParams]);

    function handlePageChange(e: React.ChangeEvent<unknown>, value: number) {
        e.preventDefault();
        setPage(value);

        const params = new URLSearchParams(searchParams);
        params.set("page", value.toString());
        setSearchParams(params);
    }

    
    
    function handleSortChange(e: React.ChangeEvent<HTMLSelectElement>) {
        e.preventDefault();
        const value = e.currentTarget.value;

        setSortOption(value);

        const params = new URLSearchParams(searchParams);
        if (value !== "default") {
            params.set("sort", value);
        } else {
            params.delete("sort");
        }
        
        setSearchParams(params);
    }

    function TypeOption (type: string) {
        return (
            <div className="filter-option">
                <p>{type}</p>
                <input type="checkbox" id={`type-${type}`} name="type" value={type} onChange={(e) => {
                    if (e.currentTarget.checked) {
                        setSelectedTypes([...selectedTypes, type]);
                    } else {
                        setSelectedTypes(selectedTypes.filter((t) => t !== type));
                    }
                }} />
            </div>
        );
    }

    function SetOption (set: string) {
        return (
            <div className="filter-option">
                <p>{set}</p>
                <input type="checkbox" id={`set-${set}`} name="set" value={set} onChange={(e) => {
                    if (e.currentTarget.checked) {
                        setSelectedSets([...selectedSets, set]);
                    } else {
                        setSelectedSets(selectedSets.filter((v) => v !== set));
                    }
                }} />
            </div>
        );
    }

    function SeriesOption (serie: string) {
        return (
            <div className="filter-option">
                <p>{serie}</p>
                <input type="checkbox" id={`serie-${serie}`} name="serie" value={serie} onChange={(e) => {
                    if (e.currentTarget.checked) {
                        setSelectedSeries([...selectedSeries, serie]);
                    } else {
                        setSelectedSeries(selectedSeries.filter((s) => s !== serie));
                    }
                }} />
            </div>
        );
    }

    function applyFilters() {
        const params = new URLSearchParams();
        params.append("name", searchParams.get("name") || "");
        if (searchParams.get("sort")) {
            params.append("sort", searchParams.get("sort") || "");
        }
        if (searchParams.get("page")) {
            params.append("page", searchParams.get("page") || "0");
        }
        selectedTypes.forEach((type) => params.append("types", type));
        selectedSets.forEach((setName) => params.append("setNames", setName));
        selectedSeries.forEach((serie) => params.append("series", serie));
        if (minPrice !== null) {
            params.append("minPrice", minPrice.toString());
        }
        if (maxPrice !== null) {
            params.append("maxPrice", maxPrice.toString());
        }
        if (inStock) {
            params.append("inStock", "true");
        }
        if (onSale) {
            params.append("onSale", "true");
        }
        if (sortOption !== "default") {
            params.append("sort", sortOption);
        }

        setSearchParams(params);
    }

    function clearFilters() {
        setSelectedTypes([]);
        setSelectedSets([]);
        setMinPrice(null);
        setMaxPrice(null);
        setInStock(false);
        const params = new URLSearchParams();
        params.append("name", searchParams.get("name") || "");
        setSearchParams(params);
    }

    async function AddToCart(item: Product)
    {
        const cartId = getCartId();

        await fetch("http://localhost:5231/api/cart/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                cartId,
                productId: item.id,
                quantity: 1
            })
        });
    }

    function ProductCard({ product }: { product: Product })  {
        return (
            <Grid size={4} sx={{height: "510px", padding: "0.25rem"}}>
                <Card sx={{height: "100%", padding: "0.25rem", position: "relative", display: "flex", flexDirection: "column"}} >
                    <Button sx={{alignSelf: "end"}} size='small'>
                        <FavoriteBorderIcon></FavoriteBorderIcon>
                    </Button>
                    <CardActionArea component={Link} to={`/product/${product.id}`}>
                        <CardMedia sx={{height: "300px", backgroundSize: "contain", margin: "0.25rem"}}image={product.images[0]} title={product.name}/>
                        
                        <CardContent sx={{padding: "0.25rem", flex: 1, display: "flex", flexDirection: "column"}}>
                            <h2 className='truncate font-bold text-xl text-lightBlue'> {product.name} </h2>
                            <div className="flex justify-between text-xs">
                                <div>
                                    {/* NIET VERGETEN REVIEWS ECHT TE LADEN HIERO */}
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <StarIcon
                                        key={index}
                                        sx={{ color: "var(--pokeYellow)" }}
                                        fontSize="small"
                                    />
                                ))}
                                </div>
                                <p>666 reviews</p>
                            </div>
                            <ul className='flex flex-1 flex-col justify-evenly p-1'>
                                <li className="flex justify-between">
                                    <p className="font-bold">Set</p>
                                    <p>{product.set.name}</p>
                                </li>
                                <li className="flex justify-between">
                                    <p className="font-bold">Series</p>
                                    <p>{product.set.series}</p>
                                </li>
                                <li className="flex justify-between">
                                    <p className="font-bold">Type</p>
                                    <p>{product.type}</p>
                                </li>
                            </ul>
                        </CardContent>
                    </CardActionArea>
                    <CardActions sx={{justifyContent: "space-between", padding: "0.25rem"}} disableSpacing>
                        <h2>€{product.price.toString()}</h2>
                        <Button size="small" onClick={() => AddToCart(product)}>
                            <AddShoppingCartIcon />
                        </Button>
                    </CardActions>
                </Card>
            </Grid>
        );
    }


    
    return (
        <main className="flex flex-col min-h-screen bg-offWhite">
            <Navbar/>

            <div id="search-page" className="flex self-center max-w-screen-xl p-1 bg-white">

                <section id="sidebar" className="flex flex-col flex-1 max-w-72 p-1">
                    <h2>FILTERS</h2>
                    <div className="filters">
                        <form className="filter-type">
                            <p>TYPE: {types.length}</p>
                            {types.map(type => (
                                <div key={type}>
                                    {TypeOption(type)}
                                </div>
                            ))}
                        </form>
                        <form className="filter-set">
                            <p>SET: {sets.length}</p>
                            {sets.map(set => (
                                <div key={set}>
                                    {SetOption(set)}
                                </div>
                            ))}
                        </form>
                        <form className="filter-series">
                            <p>SERIES: {series.length}</p>
                            {series.map(serie => (
                                <div key={serie}>
                                    {SeriesOption(serie)}
                                </div>
                            ))}
                        </form>
                        <p>MIN PRICE</p>
                        <input className="filter-minPrice" type="number" placeholder="0" onChange={
                            (e) => setMinPrice(e.currentTarget.value ? parseInt(e.currentTarget.value) : null)
                        } />
                        <p>MAX PRICE</p>
                        <input className="filter-maxPrice" type="number" placeholder="-" onChange={
                            (e) => setMaxPrice(e.currentTarget.value ? parseInt(e.currentTarget.value) : null)
                        } />
                        <p>ON SALE</p>
                        <input className="filter-onSale" type="checkbox" name="On Sale" onChange={
                            (e) => setOnSale(e.currentTarget.checked)
                        } />
                        <p>IN STOCK</p>
                        <input className="filter-inStock" type="checkbox" name="In Stock" onChange={
                            (e) => setInStock(e.currentTarget.checked)
                        } />
                        <button className="apply-filters-button" onClick={applyFilters}>APPLY FILTERS</button>
                        <button className="clear-filters-button" onClick={clearFilters}>CLEAR FILTERS</button>
                    </div>
                </section>


                <section id="results-content" className="flex flex-col flex-1 p-1">

                    <header className="flex justify-end p-1 gap-4">
                        <h2>{totalCount} RESULTS</h2>
                        <select className="bg-lightYellow rounded-lg" onChange={handleSortChange}>
                            <option value="default">DEFAULT</option>
                            <option value="priceLowHigh">PRICE: LOW TO HIGH</option>
                            <option value="priceHighLow">PRICE: HIGH TO LOW</option>
                        </select>
                    </header>

                    <Grid container spacing={2} sx={{paddingBottom: "2rem"}}>
                        {searchResults.map(result => (
                            <ProductCard key={result.id} product={result} />
                        ))}
                    </Grid>

                    <Pagination sx={{alignSelf: "center", "& .Mui-selected": {backgroundColor: "var(--pokeYellow)", color: "#000"}}} 
                        count={Math.ceil(totalCount / PAGE_SIZE)} page={page} onChange={handlePageChange} shape="rounded">
                    </Pagination>
                </section>
            </div>
        </main>
    )
}