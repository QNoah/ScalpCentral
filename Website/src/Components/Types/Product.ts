import type { Set } from "./Set.ts";

export type Product = {
    id : number,
    name : string,
    type : string,
    description : string,
    price : number,
    salePriceModifier : number,
    stock : number,

    set : Set,
    images : string[]
}