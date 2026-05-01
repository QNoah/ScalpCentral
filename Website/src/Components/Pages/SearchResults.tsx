import '../Styling/Search.css';
import Navbar from '../PageParts/Navbar';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Product } from '../Types/Product.ts';
import type { Set } from '../Types/Set.ts';
// import { Heart, ShoppingCart, Star } from 'lucide-react';

export function SearchResults() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchResults, setSearchResults] = useState<Product[]>([]);

    const [types, setTypes] = useState<string[]>([]);
    const [sets, setSets] = useState<Set[]>([]);
    const [series, setSeries] = useState<string[]>([]);

    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [selectedSets, setSelectedSets] = useState<string[]>([]);
    const [selectedSeries, setSelectedSeries] = useState<string[]>([]);
    const [minPrice, setMinPrice] = useState<number | null>(null);
    const [maxPrice, setMaxPrice] = useState<number | null>(null);
    const [inStock, setInStock] = useState<boolean>(false);

    useEffect(() => {
        async function fetchSearchResults() {
            const response = await fetch(`http://localhost:5231/api/products?${searchParams.toString()}`);
            const data: Product[] = await response.json();
            setSearchResults(data);
            
            const uniqueTypes: string[] = [];
            const uniqueSets: Set[] = [];
            const uniqueSeries: string[] = [];
            console.log(data);
            data.forEach((result: Product) => {
                if (!uniqueTypes.includes(result.type)) {
                    uniqueTypes.push(result.type);
                }
                if (!uniqueSets.some(s => s.name === result.set.name)) {
                    uniqueSets.push(result.set);
                }
                if (!uniqueSeries.includes(result.set.series)) {
                    uniqueSeries.push(result.set.series);
                }
            });
            setTypes(uniqueTypes);
            setSets(uniqueSets);
            setSeries(uniqueSeries);
        };

        fetchSearchResults();
    }, [searchParams]);

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

    function SetOption (set: Set) {
        return (
            <div className="filter-option">
                <p>{set.name}</p>
                <input type="checkbox" id={`set-${set.name}`} name="set" value={set.name} onChange={(e) => {
                    if (e.currentTarget.checked) {
                        setSelectedSets([...selectedSets, set.name]);
                    } else {
                        setSelectedSets(selectedSets.filter((v) => v !== set.name));
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
        selectedTypes.forEach((type) => params.append("type", type));
        selectedSets.forEach((setName) => params.append("setName", setName));
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

    function ProductCard (data: Product)  {
        return (
            <div className="product-card">
                <div style={{display:"flex", justifyContent:"center", height:"200px"}}>
                    <img src={data.images[0]} alt={data.name} className="product-card-image" />
                </div>

                <button className="product-card-bookmark-button">HEART ICON</button>
                
                <div className="product-card-content">
                    <h3 className="product-card-title">{data.name}</h3>
                    <div className="product-card-review-info">
                        <p>STAR ICONS</p>
                        <p >REVIEW COUNT</p>
                    </div>
                    <p className="product-card-description" dangerouslySetInnerHTML={{__html:data.description}}></p>
                </div>
                <p className="product-card-price">€{data.price.toString()}</p>
                <button className="product-card-add-to-cart-button">ADD TO CART</button>

            </div>
        );
    }

    
    return (
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
                            {sets.map((set: Set) => SetOption(set))}
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
                        <h2 className="results-count">{searchResults.length} RESULTS</h2>
                        <select className="sort-dropdown">
                            <option value="relevance">RELEVANCE</option>
                            <option value="priceLowHigh">PRICE: LOW TO HIGH</option>
                            <option value="priceHighLow">PRICE: HIGH TO LOW</option>
                            <option value="newest">NEWEST</option>
                        </select>
                    </div>
                    <div className="results-grid">
                        {searchResults.map(result => ProductCard(result))}
                    </div>
                </div>
            </div>
        </div>

    )
}

{/* <div className="retro-search-bar">
              <Search className="retro-search-icon" size={20} />
              <input
                type="text"
                placeholder="SEARCH PRODUCTS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="retro-search-input"
              />
            </div> */}