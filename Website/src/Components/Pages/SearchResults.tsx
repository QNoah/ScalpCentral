import Navbar from '../Utils/Navbar.tsx';
import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import type { Product } from '../Types/Product.ts';
import { Grid, Pagination, Card, CardMedia, CardContent, CardActions, List, ListItemButton, Button, CardActionArea, Collapse, Checkbox } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import StarIcon from '@mui/icons-material/Star';
import { getCartId } from '../Utils/Cart.ts';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useAuth } from "../Functionalities/AuthContext";

export function SearchResults() {
    // Ik realiseer mij nu pas dat ik objects had kunnen gebruiken om al deze shit compacter te maken, geen zin in tho -dabboloosefun
    // comment omdat git tracking wack is
    const { user } = useAuth();

    const PAGE_SIZE = 24;
    const [page, setPage] = useState<number>(0);
    const [totalCount, setTotalCount] = useState<number>(0);

    const [loading, SetLoading] = useState<boolean>(true);

    const [searchParams, setSearchParams] = useSearchParams();
    const searchName = searchParams.get("name") || "";
    const [searchResults, setSearchResults] = useState<Product[]>([]);

    const [types, setTypes] = useState<string[]>([]);
    const [sets, setSets] = useState<string[]>([]);
    const [series, setSeries] = useState<string[]>([]);

    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [selectedSets, setSelectedSets] = useState<string[]>([]);
    const [selectedSeries, setSelectedSeries] = useState<string[]>([]);
    const [collapseTypes, setCollapseTypes] = useState<boolean>(true);
    const [collapseSets, setCollapseSets] = useState<boolean>(true);
    const [collapseSeries, setCollapseSeries] = useState<boolean>(true);

    const [minPrice, setMinPrice] = useState<number | null>(null);
    const [maxPrice, setMaxPrice] = useState<number | null>(null);
    const [inStock, setInStock] = useState<boolean>(false);
    const [onSale, setOnSale] = useState<boolean>(false);
    const [sortOption, setSortOption] = useState<string>("default");

    const [bookmarks, setBookmarks] = useState<number[]>([])

    useEffect (() => {
        async function fetchFilters() {
            const response = await fetch(`http://localhost:5231/api/products/filters?name=${searchName}`, {
                credentials: "include"
            });
                const data = await response.json();
                setTypes(data.types);
                setSets(data.sets);
                setSeries(data.series);
        }
        fetchFilters();
    }, [searchName])

    useEffect(() => {
        async function fetchSearchResults() {
            const response = await fetch(`http://localhost:5231/api/products/paged?${searchParams.toString()}`, {
                method: "GET",
                headers: {
                    "limit": PAGE_SIZE.toString()
                },
                credentials: "include"
            });
            const data = await response.json();
            setSearchResults(data.result);
            setTotalCount(data.totalCount);
            SetLoading(false);
        };

        fetchSearchResults();
    }, [searchParams]);

    useEffect (() => {
        async function fetchBookmarks() {
            if (user)
            {
                const response = await fetch(`http://localhost:5231/api/users/${user?.id}/bookmarks`, {
                    method: "GET"
                });
                const data = await response.json();
                setBookmarks(data);
            }
        }

        fetchBookmarks();
    }, [user])

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

    function Option (item: string, option: number) {
        return (
            <div className="flex justify-between p-1">
                <h3>{item}</h3>
                <Checkbox sx={{padding: 0, "&.Mui-checked": {color: "var(--lightPokeBlue)"}}}
                    size="small" id={`item-${item}`} name="item" value={item} onChange={(e) => {
                    if (e.currentTarget.checked) {
                        switch (option) {
                            case 1:
                                setSelectedTypes([...selectedTypes, item]);
                                break;
                            case 2:
                                setSelectedSets([...selectedSets, item]);
                                break;
                            case 3:
                                setSelectedSeries([...selectedSeries, item]);
                                break;
                        }
                    } else {
                        switch (option) {
                            case 1:
                                setSelectedTypes(selectedTypes.filter((t) => t !== item));
                                break;
                            case 2:
                                setSelectedSets(selectedSets.filter((t) => t !== item));
                                break;
                            case 3:
                                setSelectedSeries(selectedSeries.filter((t) => t !== item));
                                break;
                        }
                    }
                }} />
            </div>
        );
    }

    function Filter (title: string) {
        switch (title) {
            case "Types":
                return (
                    <List className='pb-8'>
                        <ListItemButton sx={{display: "flex", justifyContent: "space-between", backgroundColor: "var(--lightPokeYellow)", fontWeight: "600"}}
                        onClick={() => setCollapseTypes(!collapseTypes)}>
                            TYPE: {types.length}
                            {collapseTypes ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        <Collapse in={collapseTypes}>
                            {types.map((type: string) => (
                                <div key={`type-${type}`}>
                                    {Option(type, 1)}
                                </div>
                            ))}
                        </Collapse>
                    </List>
                );
            case "Sets":
                return (
                    <List className='pb-8'>
                        <ListItemButton sx={{display: "flex", justifyContent: "space-between", backgroundColor: "var(--lightPokeYellow)", fontWeight: "600"}}
                        onClick={() => setCollapseSets(!collapseSets)}>
                            SET: {sets.length}
                            {collapseSets ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        <Collapse in={collapseSets}>
                            {sets.map((set: string) => (
                                <div key={`set-${set}`}>
                                    {Option(set, 2)}
                                </div>
                            ))}
                        </Collapse>
                    </List>
                );
            case "Series":
                return (
                    <List className='pb-8'>
                        <ListItemButton sx={{display: "flex", justifyContent: "space-between", backgroundColor: "var(--lightPokeYellow)", fontWeight: "600"}}
                        onClick={() => setCollapseSeries(!collapseSeries)}>
                            SERIES: {series.length}
                            {collapseSeries ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        <Collapse in={collapseSeries}>
                            {series.map((serie: string) => (
                                <div key={`series-${serie}`}>
                                    {Option(serie, 3)}
                                </div>
                            ))}
                        </Collapse>
                    </List>
                );
        }
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
        setSelectedSeries([]);
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
            credentials: "include",
            body: JSON.stringify({
                cartId,
                productId: item.id,
                quantity: 1
            })
        });
    }

    async function BookmarkProduct(product: Product)
    {
        if (bookmarks.includes(product.id)) {
            // Remove bookmark
            setBookmarks(prev => prev.filter(id => id !== product.id))

            await fetch(`http://localhost:5231/api/users/${user?.id}/bookmarks/${product.id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            });
        } else {
            // Add bookmark
            setBookmarks(prev => [...prev, product.id])

            await fetch(`http://localhost:5231/api/users/${user?.id}/bookmarks`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ProductId: product.id,
                    UserId: user?.id
                })
            });
        }
    }

    function ProductCard({ product }: { product: Product })  {
        return (
            <Grid size={4} sx={{height: "530px", padding: "0.25rem"}}>
                <Card sx={{height: "100%", padding: "0.25rem", position: "relative", display: "flex", flexDirection: "column"}}>
                    {user ? <Button sx={{alignSelf: "end"}} size='small' onClick={() => BookmarkProduct(product)}>
                        {
                            bookmarks.includes(product.id) ?
                            <FavoriteIcon></FavoriteIcon> :
                            <FavoriteBorderIcon></FavoriteBorderIcon>
                        }
                    </Button> : null}
                    <CardActionArea component={Link} to={`/product/${product.id}`}>
                        <CardMedia sx={{height: "300px", backgroundSize: "contain", margin: "0.25rem"}}image={product.images[0]} title={product.name}/>
                        
                        <CardContent sx={{padding: "0.25rem", flex: 1, display: "flex", flexDirection: "column"}}>
                            <h2 className='truncate font-bold text-xl text-lightBlue'> {product.name} </h2>
                            <div className="flex justify-between text-xs">
                                <div>
                                  {/* NIET VERGETEN REVIEWS ECHT TE LADEN HIERO */}
                                  {Array.from({ length: 3 }).map((_, index) => (
                                      <StarIcon
                                          key={index}
                                          sx={{ color: "var(--darkPokeYellow)" }}
                                          fontSize="small"
                                      />
                                  ))}
                                  <StarHalfIcon sx={{color: "var(--darkPokeYellow)"}} fontSize='small'/>
                                  <StarBorderIcon sx={{color: "var(--darkPokeYellow)"}} fontSize='small'/>
                                </div>
                                <p>623 reviews</p>
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


    
    return ( loading ? 
        <main className="flex flex-col min-h-screen bg-offWhite">
            <Navbar/>
            <div id="search-page" className="flex self-center max-w-screen-xl p-1 bg-white">
                <h1 className='self-center'>Loading...</h1>
            </div>
        </main>
        : 
        <main className="flex flex-col min-h-screen bg-offWhite">
            <Navbar/>

            <div id="search-page" className="flex self-center max-w-screen-xl p-1 bg-white">

                <section id="sidebar" className="flex flex-col flex-1 max-w-72 p-1">
                    <h2 className= 'font-bold'>FILTERS</h2>
                    <div className="flex flex-col p-1">
                        {Filter("Types")}
                        {Filter("Sets")}
                        {Filter("Series")}
                        <br></br>
                        <p className='font-medium'>MIN PRICE</p>
                        <input type="number" placeholder="0" onChange={
                            (e) => setMinPrice(e.currentTarget.value ? parseInt(e.currentTarget.value) : null)
                        } />
                        <br></br>
                        <p className='font-medium'>MAX PRICE</p>
                        <input type="number" placeholder="-" onChange={
                            (e) => setMaxPrice(e.currentTarget.value ? parseInt(e.currentTarget.value) : null)
                        } />
                        <br></br>
                        <div className="flex justify-between p-1">
                            <p className='font-medium'>ON SALE</p>
                            <input className="filter-onSale" type="checkbox" name="On Sale" onChange={
                                (e) => setOnSale(e.currentTarget.checked)
                            } />
                        </div>
                        <br></br>
                        <div className="flex justify-between p-1">
                            <p className='font-medium'>IN STOCK</p>
                            <input type="checkbox" name="In Stock" onChange={
                                (e) => setInStock(e.currentTarget.checked)
                            } />
                        </div>
                        <br></br>
                        <Button sx={{
                                backgroundColor: "#F1F979", 
                                color: "black",
                                flex: 1
                                }} variant="contained" onClick={applyFilters}>APPLY FILTERS</Button>
                        <br></br>
                        <Button sx={{
                                backgroundColor: "#F1F979", 
                                color: "black",
                                flex: 1
                                }} variant="contained" onClick={clearFilters}>CLEAR FILTERS</Button>
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
