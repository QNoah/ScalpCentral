import { useLocation, useParams } from "react-router-dom";
import Navbar from "../../Utils/Navbar";
import {useEffect, useState } from "react";
import type { Product } from "../../Types/Product";
import Input from "../../Utils/Input";

type LocationState = { product?: Product };

export default function ProductEdit(){
  const { id } = useParams<{ id: string }>();
  const productId = id ? Number(id) : NaN;
  const invalid = !id || Number.isNaN(productId);

  const location = useLocation();
  const state = location.state as LocationState | null;

  const [product, setProduct] = useState<Product | null>(state?.product ?? null);

   useEffect(() => {
    if (!invalid && !product) {
      (async () => {
        const res = await fetch(`http://localhost:5231/api/products/${productId}`);
        const data = await res.json();
        setProduct(data.result ?? data);
      })();
    }
  }, [invalid, productId, product]);

    if(invalid){ 
        return(
        <div>
            <Navbar/>
        (<h1 className="text-center mt-5">Unknown product</h1>)
        </div>
    );
}
  if (!product) {
    return (
      <div>
        <Navbar />
        <h1 className="text-center mt-5">Laden...</h1>
      </div>
    );
  }

    return(
        <div>
            <Navbar/>
        <div className="flex justify-center">
            <div className="border shadow rounded-lg w-1/2 mt-10">
            <h1 className="mt-2 text-center">{product.name}</h1>
            <div className="w-full"></div>
            <Input label="Name" type="text" value={product.name} required={true} styles="w-full"/>
            </div>
        </div>
        </div>
    )
}