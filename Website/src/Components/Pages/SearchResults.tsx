import '../Styling/Search.css';
import Navbar from '../Utils/Navbar.tsx';
import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import type { Product } from '../Types/Product.ts';
// import { Heart, ShoppingCart, Star } from 'lucide-react';

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

    function handlePageChange(newPage: number) {
        setPage(newPage);
        const params = new URLSearchParams(searchParams);
        params.set("page", newPage.toString());
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

    function renderButtons() {
        const totalPages = Math.ceil(totalCount / PAGE_SIZE);
        const buttons = [];
        for (let i = 0; i < totalPages; i++) {
            buttons.push(
                <button key={i} className={`pagination-button ${i === page ? "active" : ""}`} onClick={() => handlePageChange(i)}>
                    {i + 1}
                </button>
            );
        }
        return buttons;
    }   
    
    function ProductCard (data: Product)  {
        return (
            <div className="product-card">
                <div style={{display:"flex", justifyContent:"center", height:"200px"}}>
                    <img src={data.images[0]} alt={data.name} className="product-card-image" />
                </div>

                <button className="product-card-bookmark-button">HEART ICON</button>
                
                <div className="product-card-content">
                    <h3 className="product-card-title"><Link to={`/product/${data.id}`}>{data.name}</Link></h3>
                    <div className="product-card-review-info">
                        <p>STAR ICONS</p>
                        <p >REVIEW COUNT</p>
                    </div>
                    <div className="product-card-description" dangerouslySetInnerHTML={{__html:data.description}}></div>
                </div>
                <p className="product-card-price">€{data.price.toString()}</p>
                <button className="product-card-add-to-cart-button">ADD TO CART</button>

            </div>
        );
    }

    
    return (
        <main>
            <div className="container-search">
                <Navbar />
                <div className="search-content">
                    <div className="sidebar">
                        <h2 className="sidebar-header">FILTERS</h2>
                        <div className="filters">
                            <form className="filter-type">
                                <p>TYPE: {types.length}</p>
                                {types.map((type: string) => TypeOption(type))}
                            </form>
                            <form className="filter-set">
                                <p>SET: {sets.length}</p>
                                {sets.map((set: string) => SetOption(set))}
                            </form>
                            <form className="filter-series">
                                <p>SERIES: {series.length}</p>
                                {series.map((serie: string) => SeriesOption(serie))}
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
                    </div>
                    <div className="results-content">
                        <div className="results-header">
                            <h2 className="results-count">{totalCount} RESULTS</h2>
                            <select className="sort-dropdown" onChange={handleSortChange}>
                                <option value="default">DEFAULT</option>
                                <option value="priceLowHigh">PRICE: LOW TO HIGH</option>
                                <option value="priceHighLow">PRICE: HIGH TO LOW</option>
                            </select>
                        </div>
                        <div className="results-grid">
                            {searchResults.map(result => ProductCard(result))}
                        </div>
                        <div className="pagination">
                            {renderButtons()}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}