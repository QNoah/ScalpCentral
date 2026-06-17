import { useLocation, useNavigate, useParams } from "react-router-dom";
import Navbar from "../../Utils/Navbar";
import {useEffect, useState } from "react";
import type { Product } from "../../Types/Product";
import Input from "../../Utils/Input";
import { Link } from 'react-router-dom';

type LocationState = { product?: Product };

export default function ProductEdit(){
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const productId = id ? Number(id) : NaN;
  const invalid = !id || Number.isNaN(productId);

  const location = useLocation();
  const state = location.state as LocationState | null;

  const [product, setProduct] = useState<Product | null>(state?.product ?? null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleTextChange(field: "name" | "type", value: string){
    setProduct(prev => prev ? { ...prev, [field]: value} : prev);
  }

  function handleNumberChange(field: "price" | "stock" | "salePriceModifier", value: string){
    const parsedValue = Number(value);
    setProduct(prev => prev ? { ...prev, [field]: Number.isNaN(parsedValue) ? 0 : parsedValue} : prev);
  }

  function handleImageChange(value: string) {
    setProduct(prev => prev ? { ...prev, images: [value, ...prev.images.slice(1)] } : prev);
  }

  async function handleSave() {
    if (!product) {
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/products/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(product)
      });

      if (!response.ok) {
        throw new Error(`Product update failed with status ${response.status}.`);
      }

      navigate("/product-list", { state: { updatedProductId: product.id } });
    } catch {
      setError("Product kon niet worden opgeslagen.");
    } finally {
      setSaving(false);
    }
  }

   useEffect(() => {
    if (!invalid && !product) {
      (async () => {
        try {
          const res = await fetch(`/api/products/${productId}`);
          if (!res.ok) {
            throw new Error();
          }

          const data = await res.json();
          setProduct(data.result ?? data);
        } catch {
          setError("Product kon niet worden geladen.");
        }
      })();
    }
  }, [invalid, product, productId]);

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
              <Input label="Name" type="text" value={product.name} required={true} styles="w-full mb-4" onChange={v => handleTextChange("name", v)}/>
              <Input label="Type" type="text" value={product.type} required={true} styles="w-full mb-4" onChange={v => handleTextChange("type", v)}/>
              <div className="flex justify-between">
                <Input label="Price" type="number" value={product.price} required={true} styles="w-full mb-4" onChange={v => handleNumberChange("price", v)}/>
                <Input label="Stock" type="number" value={product.stock} required={true} styles="w-full mb-4" onChange={v => handleNumberChange("stock", v)}/>
              </div>
                <Input label="Discount (%)" type="number" value={product.salePriceModifier} required={false} styles="w-full mb-4" maxNumber={100} onChange={v => handleNumberChange("salePriceModifier", v)}/>
                {/* geen idee hoe we dit gaan doen maar ik denk dat het belangrijk is voor meerdere foto's. */}
                <Input label="Img url" type="string" value={product.images[0] ?? ""} required={false} styles="w-full mb-4" onChange={handleImageChange}/>
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
            {error && <p className="text-red-600 mx-20">{error}</p>}
            <div className="flex place-content-end gap-4 mt-20">
              <Link className="bg-red-500 p-2 text-white" to="/product-list">Cancel</Link>
              <button className="bg-green-500 p-2 text-white disabled:opacity-60" disabled={saving} onClick={handleSave}>
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
            </div>
        </div>
        </div>
    )
}
