import type { Set } from "./Set.ts";

export type Product = {
    id : number,
    name : string,
    type : string,
    description : string,
    price : number,
    salePriceModifier : number,
    stock : number,

    sets : Set[],
    images : string[]
}