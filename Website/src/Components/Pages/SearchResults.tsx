import Navbar from '../Utils/Navbar.tsx';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Product } from '../Types/Product.ts';
import { Button, Grid, Pagination } from '@mui/material';
import { getCartId } from '../Utils/Cart.ts';
import { useAuth } from "../Functionalities/AuthContext";
import { ProductResultCard } from './SearchResultsParts/ProductResultCard.tsx';
import { SearchFilters } from './SearchResultsParts/SearchFilters.tsx';
import {
    API_BASE_URL,
    fetchJson,
    isAbortError,
    PAGE_SIZE,
    type FiltersResponse,
    type PagedProductsResponse,
} from './SearchResultsParts/searchResultsApi.ts';

export function SearchResults() {
    const { user } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();

    const queryString = searchParams.toString();
    const searchName = searchParams.get("name") || "";
    const pageParam = Number(searchParams.get("page") || "0");
    const currentPage = Number.isFinite(pageParam) && pageParam >= 0 ? pageParam : 0;
    const currentSort = searchParams.get("sort") || "default";

    const [totalCount, setTotalCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [reloadKey, setReloadKey] = useState<number>(0);

    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [types, setTypes] = useState<string[]>([]);
    const [sets, setSets] = useState<string[]>([]);
    const [series, setSeries] = useState<string[]>([]);

    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [selectedSets, setSelectedSets] = useState<string[]>([]);
    const [selectedSeries, setSelectedSeries] = useState<string[]>([]);

    const [minPrice, setMinPrice] = useState<string>("");
    const [maxPrice, setMaxPrice] = useState<string>("");
    const [inStock, setInStock] = useState<boolean>(false);
    const [onSale, setOnSale] = useState<boolean>(false);

    const [bookmarks, setBookmarks] = useState<number[]>([]);
    const [bookmarkError, setBookmarkError] = useState<string | null>(null);
    const [cartError, setCartError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        async function loadSearchPage() {
            setLoading(true);
            setError(null);

            try {
                const productUrl = `${API_BASE_URL}/products/paged?${queryString}`;
                const filtersUrl = `${API_BASE_URL}/products/filters?name=${encodeURIComponent(searchName)}`;

                const [productsData, filtersData] = await Promise.all([
                    fetchJson<PagedProductsResponse>(
                        productUrl,
                        {
                            method: "GET",
                            headers: {
                                "limit": PAGE_SIZE.toString(),
                            },
                        },
                        controller.signal,
                        "Products could not be loaded.",
                    ),
                    fetchJson<FiltersResponse>(
                        filtersUrl,
                        { method: "GET" },
                        controller.signal,
                        "Filters could not be loaded.",
                    ),
                ]);

                setSearchResults(productsData.result ?? []);
                setTotalCount(productsData.totalCount ?? 0);
                setTypes(filtersData.types ?? []);
                setSets(filtersData.sets ?? []);
                setSeries(filtersData.series ?? []);
            } catch (caughtError) {
                if (isAbortError(caughtError)) return;

                setSearchResults([]);
                setTotalCount(0);
                setError(caughtError instanceof Error ? caughtError.message : "Something went wrong while loading products.");
            } finally {
                setLoading(false);
            }
        }

        loadSearchPage();

        return () => controller.abort();
    }, [queryString, searchName, reloadKey]);

    useEffect(() => {
        const controller = new AbortController();

        async function loadBookmarks() {
            setBookmarkError(null);

            if (!user) {
                setBookmarks([]);
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/users/${user.id}/bookmarks`, {
                    method: "GET",
                    credentials: "include",
                    signal: controller.signal,
                });

                if (!response.ok) {
                    throw new Error(`Bookmarks could not be loaded. Status: ${response.status}`);
                }

                const data = await response.json() as number[];
                setBookmarks(data);
            } catch (caughtError) {
                if (isAbortError(caughtError)) return;

                setBookmarks([]);
                setBookmarkError(caughtError instanceof Error ? caughtError.message : "Bookmarks could not be loaded.");
            }
        }

        loadBookmarks();

        return () => controller.abort();
    }, [user]);

    function handleReload() {
        setReloadKey((current) => current + 1);
    }

    function handlePageChange(event: React.ChangeEvent<unknown>, value: number) {
        event.preventDefault();

        const params = new URLSearchParams(searchParams);
        params.set("page", (value - 1).toString());
        setSearchParams(params);
    }

    function handleSortChange(event: React.ChangeEvent<HTMLSelectElement>) {
        const value = event.currentTarget.value;
        const params = new URLSearchParams(searchParams);

        if (value !== "default") {
            params.set("sort", value);
        } else {
            params.delete("sort");
        }

        params.set("page", "0");
        setSearchParams(params);
    }

    function applyFilters() {
        const params = new URLSearchParams();
        params.set("name", searchName);
        params.set("page", "0");

        if (currentSort !== "default") {
            params.set("sort", currentSort);
        }

        selectedTypes.forEach((type) => params.append("types", type));
        selectedSets.forEach((setName) => params.append("setNames", setName));
        selectedSeries.forEach((serie) => params.append("series", serie));

        if (minPrice) {
            params.set("minPrice", minPrice);
        }

        if (maxPrice) {
            params.set("maxPrice", maxPrice);
        }

        if (inStock) {
            params.set("inStock", "true");
        }

        if (onSale) {
            params.set("onSale", "true");
        }

        setSearchParams(params);
    }

    function clearFilters() {
        setSelectedTypes([]);
        setSelectedSets([]);
        setSelectedSeries([]);
        setMinPrice("");
        setMaxPrice("");
        setInStock(false);
        setOnSale(false);

        const params = new URLSearchParams();
        params.set("name", searchName);

        if (currentSort !== "default") {
            params.set("sort", currentSort);
        }

        params.set("page", "0");
        setSearchParams(params);
    }

    async function addToCart(item: Product) {
        const cartId = getCartId();
        setCartError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/cart/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    cartId,
                    productId: item.id,
                    quantity: 1,
                }),
            });

            if (!response.ok) {
                throw new Error(`Product could not be added to the cart. Status: ${response.status}`);
            }
        } catch (caughtError) {
            setCartError(caughtError instanceof Error ? caughtError.message : "Product could not be added to the cart.");
        }
    }

    async function bookmarkProduct(product: Product) {
        if (!user) return;

        setBookmarkError(null);
        const wasBookmarked = bookmarks.includes(product.id);
        setBookmarks((current) =>
            wasBookmarked
                ? current.filter((id) => id !== product.id)
                : [...current, product.id],
        );

        try {
            const response = await fetch(
                wasBookmarked
                    ? `${API_BASE_URL}/users/${user.id}/bookmarks/${product.id}`
                    : `${API_BASE_URL}/users/${user.id}/bookmarks`,
                {
                    method: wasBookmarked ? "DELETE" : "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: wasBookmarked
                        ? undefined
                        : JSON.stringify({
                            ProductId: product.id,
                            UserId: user.id,
                        }),
                },
            );

            if (!response.ok) {
                throw new Error(`Bookmark could not be updated. Status: ${response.status}`);
            }
        } catch (caughtError) {
            setBookmarks((current) =>
                wasBookmarked
                    ? [...current, product.id]
                    : current.filter((id) => id !== product.id),
            );
            setBookmarkError(caughtError instanceof Error ? caughtError.message : "Bookmark could not be updated.");
        }
    }

    if (loading || error) {
        return (
            <main className="flex flex-col min-h-screen bg-offWhite">
                <Navbar />
                <div id="search-page" className="flex min-h-[50vh] w-full max-w-screen-xl self-center items-center justify-center p-4">
                    {loading && <h1 className="self-center">Loading...</h1>}
                    {error && (
                        <div className="flex max-w-xl flex-col items-center gap-4 bg-white p-6 text-center shadow-sm">
                            <h1 className="text-lightBlue">Could not load products</h1>
                            <p className="text-slate-700">{error}</p>
                            <Button
                                sx={{
                                    backgroundColor: "#F1F979",
                                    color: "black",
                                    fontWeight: 700,
                                }}
                                variant="contained"
                                onClick={handleReload}
                            >
                                Load again
                            </Button>
                        </div>
                    )}
                </div>
            </main>
        );
    }

    return (
        <main className="flex flex-col min-h-screen bg-offWhite">
            <Navbar />

            <div id="search-page" className="flex self-center max-w-screen-xl p-1 bg-white">
                <SearchFilters
                    types={types}
                    sets={sets}
                    series={series}
                    selectedTypes={selectedTypes}
                    selectedSets={selectedSets}
                    selectedSeries={selectedSeries}
                    minPrice={minPrice}
                    maxPrice={maxPrice}
                    inStock={inStock}
                    onSale={onSale}
                    setSelectedTypes={setSelectedTypes}
                    setSelectedSets={setSelectedSets}
                    setSelectedSeries={setSelectedSeries}
                    setMinPrice={setMinPrice}
                    setMaxPrice={setMaxPrice}
                    setInStock={setInStock}
                    setOnSale={setOnSale}
                    onApply={applyFilters}
                    onClear={clearFilters}
                />
                <section id="results-content" className="flex flex-col flex-1 p-1">
                    <header className="flex justify-end p-1 gap-4">
                        <h2>{totalCount} RESULTS</h2>
                        <select className="bg-lightYellow rounded-lg" value={currentSort} onChange={handleSortChange}>
                            <option value="default">DEFAULT</option>
                            <option value="priceLowHigh">PRICE: LOW TO HIGH</option>
                            <option value="priceHighLow">PRICE: HIGH TO LOW</option>
                        </select>
                    </header>

                    {bookmarkError && (
                        <p className="mb-3 bg-lightYellow p-3 text-sm font-medium text-slate-900">
                            {bookmarkError}
                        </p>
                    )}

                    {cartError && (
                        <p className="mb-3 bg-lightYellow p-3 text-sm font-medium text-slate-900">
                            {cartError}
                        </p>
                    )}

                    {searchResults.length === 0 ? (
                        <div className="flex min-h-64 items-center justify-center">
                            <h2>No products found</h2>
                        </div>
                    ) : (
                        <Grid container spacing={2} sx={{ paddingBottom: "2rem" }}>
                            {searchResults.map(result => (
                                <ProductResultCard
                                    key={result.id}
                                    product={result}
                                    isLoggedIn={Boolean(user)}
                                    isBookmarked={bookmarks.includes(result.id)}
                                    onBookmark={bookmarkProduct}
                                    onAddToCart={addToCart}
                                />
                            ))}
                        </Grid>
                    )}

                    <Pagination
                        sx={{ alignSelf: "center", "& .Mui-selected": { backgroundColor: "var(--pokeYellow)", color: "#000" } }}
                        count={Math.ceil(totalCount / PAGE_SIZE)}
                        page={currentPage + 1}
                        onChange={handlePageChange}
                        shape="rounded"
                    />
                </section>
            </div>
        </main>
    );
}
