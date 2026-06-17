import { useCallback, useEffect, useState } from "react";
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

const emptyAddress: CheckoutForm = {
  phoneNumber: "",
  country: "",
  city: "",
  postcode: "",
  streetName: "",
  streetNumber: ""
};

const textPattern = "^[A-Za-zÀ-ž\\s'-]{2,255}$";
const postcodePattern = "^[A-Za-z0-9\\s-]{3,12}$";
const streetNumberPattern = "^[0-9A-Za-z\\s/-]{1,20}$";
const phonePattern = "^\\+?[0-9\\s().-]{7,20}$";

function getAddressFromUser(user: ReturnType<typeof useAuth>["user"]): CheckoutForm {
  if (!user) {
    return emptyAddress;
  }

  return {
    phoneNumber: user.phoneNumber ?? "",
    country: user.country ?? "",
    city: user.city ?? "",
    postcode: user.postcode ?? "",
    streetName: user.streetName ?? "",
    streetNumber: user.streetNumber ?? ""
  };
}

function hasAddress(user: ReturnType<typeof useAuth>["user"]) {
  return Boolean(user?.country && user.city && user.postcode && user.streetName && user.streetNumber);
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [products, setProducts] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [addressSelected, setAddressSelected] = useState(() => hasAddress(user));
  const [form, setForm] = useState<CheckoutForm>(() => getAddressFromUser(user));
  const savedAddressAvailable = hasAddress(user);

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

  const applySavedAddress = useCallback(() => {
    setForm(getAddressFromUser(user));
    setAddressSelected(true);
  }, [user]);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setAddressSelected(false);
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  }

  function getTotal() {
    return products.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }

  async function saveAddress() {
    if (!user) return;

    const response = await fetch(`/api/users/${user.id}/address`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(form)
    });

    if (response.ok) {
      const updatedUser = await response.json();
      setUser(updatedUser);
    }
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

    const orderResponse = await fetch("/api/order", {
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
        streetNumber: form.streetNumber,
        items: products.map(item => ({
          productId: item.product.id,
          amount: item.quantity
        }))
      })
    });

    if (!orderResponse.ok) {
      setError("Could not place order.");
      setSubmitting(false);
      return;
    }

    await saveAddress();

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
            <p className="text-sm text-slate-600 mt-2">Choose a saved address or fill in a new one.</p>
          </div>

          {error && <p className="mb-4 text-red-600 font-medium">{error}</p>}

          {savedAddressAvailable && (
            <button
              className={`mb-5 w-full rounded-lg border p-4 text-left transition ${addressSelected ? "border-midBlue bg-blue-50" : "border-slate-300 bg-offWhite hover:border-midBlue"}`}
              type="button"
              onClick={applySavedAddress}
            >
              <span className="block font-semibold text-darkBlue">Use saved address</span>
              <span className="block text-sm text-slate-600">
                {user?.streetName} {user?.streetNumber}, {user?.postcode} {user?.city}, {user?.country}
              </span>
            </button>
          )}

          <form onSubmit={placeOrder} className="grid gap-4 md:grid-cols-2">
            <input className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-midBlue" name="phoneNumber" value={form.phoneNumber} onChange={onChange} placeholder="Phone number" minLength={7} maxLength={20} pattern={phonePattern} autoComplete="tel" title="Use a valid phone number, for example +31 612345678." />
            <input className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-midBlue" name="country" value={form.country} onChange={onChange} placeholder="Country" required minLength={2} maxLength={255} pattern={textPattern} autoComplete="country-name" title="Use at least 2 letters." />
            <input className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-midBlue" name="city" value={form.city} onChange={onChange} placeholder="City" required minLength={2} maxLength={255} pattern={textPattern} autoComplete="address-level2" title="Use at least 2 letters." />
            <input className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-midBlue" name="postcode" value={form.postcode} onChange={onChange} placeholder="Postcode" required minLength={3} maxLength={12} pattern={postcodePattern} autoComplete="postal-code" title="Use a valid postcode, for example 1234 AB." />
            <input className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-midBlue" name="streetName" value={form.streetName} onChange={onChange} placeholder="Street name" required minLength={2} maxLength={255} pattern={textPattern} autoComplete="street-address" title="Use at least 2 letters." />
            <input className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-midBlue" name="streetNumber" value={form.streetNumber} onChange={onChange} placeholder="Street number" required minLength={1} maxLength={20} pattern={streetNumberPattern} title="Use a valid house number, for example 12A." />

            <div className="md:col-span-2 rounded-lg bg-offWhite border border-lightYellow p-4 flex flex-col gap-1">
              <p className="font-semibold text-darkBlue">Order summary</p>
              <p>Total: EUR {getTotal().toFixed(2)}</p>
              <p>Email: {user?.email}</p>
              <p className="text-sm text-slate-600">After checkout, this address will be saved to your profile.</p>
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
