import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Utils/Navbar";
import { getCartId } from "../Utils/Cart";
import { useAuth } from "../Functionalities/AuthContext";
import type { CartItem } from "../Types/CartItem";

type CheckoutForm = {
  phoneNumber: string;
  country: string;
  city: string;
  postcode: string;
  streetName: string;
  streetNumber: string;
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [products, setProducts] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<CheckoutForm>({
    phoneNumber: "",
    country: "",
    city: "",
    postcode: "",
    streetName: "",
    streetNumber: ""
  });

  useEffect(() => {
    async function loadCart() {
      const cartId = getCartId();

      const response = await fetch(`/api/cart/${cartId}`, {
        credentials: "include"
      });

      if (!response.ok) {
        setError("Failed to load cart.");
        setLoading(false);
        return;
      }

      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
      setLoading(false);
    }

    loadCart();
  }, []);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  }

  function getTotal() {
    return products.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }

  async function placeOrder(e: React.FormEvent) {
    e.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    if (products.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setSubmitting(true);
    setError("");

    const cartId = getCartId();
    const orderNumber = `ORD-${Date.now()}`;

    const response = await fetch("/api/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({
        orderNumber,
        userId: user.id,
        phoneNumber: form.phoneNumber,
        email: user.email,
        price: getTotal(),
        country: form.country,
        city: form.city,
        postcode: form.postcode,
        streetName: form.streetName,
        streetNumber: form.streetNumber
      })
    });

    if (!response.ok) {
      setError("Could not place order.");
      setSubmitting(false);
      return;
    }

    await fetch(`/api/cart?cartId=${cartId}`, {
      method: "DELETE",
      credentials: "include"
    });

    localStorage.removeItem("cartId");
    navigate("/order-confirmation");
  }

  if (loading) {
    return <div className="min-h-screen bg-offWhite flex items-center justify-center">Loading checkout...</div>;
  }

  return (
    <div className="min-h-screen bg-offWhite flex flex-col">
      <Navbar />
      <main className="flex-1 flex justify-center px-4 py-10">
        <section className="w-full max-w-3xl bg-white border border-lightYellow shadow-sm rounded-xl p-6 md:p-8">
          <div className="mb-6">
            <p className="text-sm uppercase tracking-[0.25em] text-midBlue">Checkout</p>
            <h1 className="text-3xl text-darkBlue">Finish your order</h1>
            <p className="text-sm text-slate-600 mt-2">Confirm your shipping details and place the order.</p>
          </div>

          {error && <p className="mb-4 text-red-600 font-medium">{error}</p>}

          <form onSubmit={placeOrder} className="grid gap-4 md:grid-cols-2">
            <input className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-midBlue" name="phoneNumber" value={form.phoneNumber} onChange={onChange} placeholder="Phone number" />
            <input className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-midBlue" name="country" value={form.country} onChange={onChange} placeholder="Country" />
            <input className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-midBlue" name="city" value={form.city} onChange={onChange} placeholder="City" />
            <input className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-midBlue" name="postcode" value={form.postcode} onChange={onChange} placeholder="Postcode" />
            <input className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-midBlue" name="streetName" value={form.streetName} onChange={onChange} placeholder="Street name" />
            <input className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-midBlue" name="streetNumber" value={form.streetNumber} onChange={onChange} placeholder="Street number" />

            <div className="md:col-span-2 rounded-lg bg-offWhite border border-lightYellow p-4 flex flex-col gap-1">
              <p className="font-semibold text-darkBlue">Order summary</p>
              <p>Total: €{getTotal().toFixed(2)}</p>
              <p>Email: {user?.email}</p>
            </div>

            <button className="md:col-span-2 rounded-lg bg-secondary px-5 py-3 font-semibold text-darkBlue disabled:opacity-60" type="submit" disabled={submitting}>
              {submitting ? "Placing order..." : "Place order"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}