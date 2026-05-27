import { useLocation, useParams } from "react-router-dom";
import Navbar from "../../Utils/Navbar";
import {useEffect, useState } from "react";
import type { Product } from "../../Types/Product";
import Input from "../../Utils/Input";
import { Link } from 'react-router-dom';

type LocationState = { product?: Product };

export default function ProductEdit(){
  const { id } = useParams<{ id: string }>();
  const productId = id ? Number(id) : NaN;
  const invalid = !id || Number.isNaN(productId);

  const location = useLocation();
  const state = location.state as LocationState | null;

  const [product, setProduct] = useState<Product | null>(state?.product ?? null);

  function handleChange(field: keyof Product, value: string){
    setProduct(prev => prev ? { ...prev, [field]: value} : prev);
  }

   useEffect(() => {
    if (!invalid && !product) {
      (async () => {
        const res = await fetch(`http://localhost:5231/api/products/${productId}`);
        const data = await res.json();
        setProduct(data.result ?? data);
      })();
    }
  }, [invalid, productId]);

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
        <h1 className="text-center mt-5">Loading...</h1>
      </div>
    );
  }

    return(
        <div>
            <Navbar/>
        <div className="flex justify-center">
            <div className="border shadow rounded-lg w-1/2 mt-10">
            <h1 className="mt-2 text-center">{product.name}</h1>
            <div className="mx-20">
              <Input label="Name" type="text" value={product.name} required={true} styles="w-full mb-4" onChange={v => handleChange("name", v)}/>
              <Input label="Type" type="text" value={product.type} required={true} styles="w-full mb-4" onChange={v => handleChange("type", v)}/>
              <div className="flex justify-between">
                <Input label="Price" type="string" value={product.price} required={true} styles="w-full mb-4" onChange={v => handleChange("price", v)}/>
                <Input label="Stock" type="number" value={product.stock} required={true} styles="w-full mb-4" onChange={v => handleChange("stock", v)}/>
              </div>
                <Input label="Discount (%)" type="number" value={product.salePriceModifier} required={false} styles="w-full mb-4" maxNumber={100} onChange={v => handleChange("salePriceModifier", v)}/>
                {/* geen idee hoe we dit gaan doen maar ik denk dat het belangrijk is voor meerdere foto's. */}
                <Input label="Img url" type="string" value={product.images} required={false} styles="w-full mb-4" onChange={v => handleChange("salePriceModifier", v)}/>
                <div id="product">
                  <h3 className="mb-4">Product preview</h3>
                  <div className="flex justify-center mb-4">
                    <img src={product.images[0]} alt="product photo" className="w-1/3"/>
                  </div>
                  <div className="product-information border shadow  rounded-lg py-2 px-4 mb-6">
                    <h4 className="font-semibold">{product.name}</h4>
                    <h6 className="font-bold">€{product.price}</h6>
                    <div className="flex">
                      <span className="mr-2">Stock: <span className="text-green-800">{product.stock}</span></span>
                      <span className="mr-2">·</span>
                      <span>{product.type}</span>
                    </div>
                  </div>
                </div>
            </div>
            <div className="flex place-content-end gap-4 mt-20">
              <Link className="bg-red-500 p-2 text-white" to="/product-list">Cancel</Link>
              <a className="bg-green-500 p-2 text-white">Save</a>
            </div>
            </div>
        </div>
        </div>
    )
}