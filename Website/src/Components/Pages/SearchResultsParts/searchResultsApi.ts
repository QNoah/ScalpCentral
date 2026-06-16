import type { Product } from "../../Types/Product.ts";

export const PAGE_SIZE = 24;
export const API_BASE_URL = "http://localhost:5231/api";

export type FiltersResponse = {
    types?: string[];
    sets?: string[];
    series?: string[];
};

export type PagedProductsResponse = {
    result?: Product[];
    totalCount?: number;
};

export async function fetchJson<T>(
    url: string,
    options: RequestInit,
    signal: AbortSignal,
    errorMessage: string,
): Promise<T> {
    const response = await fetch(url, {
        credentials: "include",
        signal,
        ...options,
    });

    if (!response.ok) {
        throw new Error(`${errorMessage} Status: ${response.status}`);
    }

    return await response.json() as T;
}

export function isAbortError(error: unknown) {
    return error instanceof DOMException && error.name === "AbortError";
}
