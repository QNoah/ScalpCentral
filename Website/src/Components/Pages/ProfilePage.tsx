import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Utils/Navbar";
import { useAuth } from "../Functionalities/AuthContext";
import type { User } from "../Types/User";
import "../Styling/Profile.css";

type ProfileUser = User;

type AccountForm = {
  firstName: string;
  lastName: string;
  email: string;
};

type AddressForm = {
  phoneNumber: string;
  country: string;
  city: string;
  postcode: string;
  streetName: string;
  streetNumber: string;
};

const namePattern = "^[A-Za-zÀ-ž\\s'-]{2,50}$";
const emailPattern = "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$";
const textPattern = "^[A-Za-zÀ-ž\\s'-]{2,255}$";
const postcodePattern = "^[A-Za-z0-9\\s-]{3,12}$";
const streetNumberPattern = "^[0-9A-Za-z\\s/-]{1,20}$";
const phonePattern = "^\\+?[0-9\\s().-]{7,20}$";

function valueOrFallback(value?: string | number | null) {
  if (value === undefined || value === null || value === "") {
    return "Not set";
  }

  return value;
}

function formatDate(value?: string) {
  if (!value) {
    return "Not set";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Not set";
  }

  return date.toLocaleDateString("en-GB").replace(/\//g, "-");
}

function getDisplayName(user: ProfileUser) {
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");
  return fullName || user.name || "ScalpCentral user";
}

function getAccountForm(user: ProfileUser): AccountForm {
  return {
    firstName: user.firstName ?? "",
    lastName: user.lastName ?? "",
    email: user.email ?? ""
  };
}

function getAddressForm(user: ProfileUser): AddressForm {
  return {
    phoneNumber: user.phoneNumber ?? "",
    country: user.country ?? "",
    city: user.city ?? "",
    postcode: user.postcode ?? "",
    streetName: user.streetName ?? "",
    streetNumber: user.streetNumber ?? ""
  };
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="profile-detail-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const profileUser = user as ProfileUser | null;
  const [editingAccount, setEditingAccount] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);
  const [savingAccount, setSavingAccount] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [message, setMessage] = useState("");
  const [accountForm, setAccountForm] = useState<AccountForm>({ firstName: "", lastName: "", email: "" });
  const [addressForm, setAddressForm] = useState<AddressForm>({
    phoneNumber: "",
    country: "",
    city: "",
    postcode: "",
    streetName: "",
    streetNumber: ""
  });

  if (!profileUser) {
    return (
      <div className="profile-page">
        <Navbar />
        <main className="profile-empty">
          <section className="profile-empty-card">
            <p className="profile-eyebrow">Profile</p>
            <h1>Login required</h1>
            <p>You need to be logged in before you can view your profile.</p>
            <Link className="profile-primary-button" to="/login">Go to login</Link>
          </section>
        </main>
      </div>
    );
  }

  const currentUser = profileUser;
  const displayName = getDisplayName(currentUser);
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0])
    .join("")
    .toUpperCase();

  function startAccountEdit() {
    setMessage("");
    setAccountForm(getAccountForm(currentUser));
    setEditingAccount(true);
  }

  function startAddressEdit() {
    setMessage("");
    setAddressForm(getAddressForm(currentUser));
    setEditingAddress(true);
  }

  function changeAccount(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setAccountForm(prev => ({ ...prev, [name]: value }));
  }

  function changeAddress(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setAddressForm(prev => ({ ...prev, [name]: value }));
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/";
  }

  async function saveAccount(e: React.FormEvent) {
    e.preventDefault();
    setSavingAccount(true);
    setMessage("");

    const response = await fetch(`/api/users/${currentUser.id}/account`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(accountForm)
    });

    setSavingAccount(false);
    if (!response.ok) {
      setMessage("Could not save account details.");
      return;
    }

    setUser(await response.json());
    setEditingAccount(false);
    setMessage("Account details saved.");
  }

  async function saveAddress(e: React.FormEvent) {
    e.preventDefault();
    setSavingAddress(true);
    setMessage("");

    const response = await fetch(`/api/users/${currentUser.id}/address`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(addressForm)
    });

    setSavingAddress(false);
    if (!response.ok) {
      setMessage("Could not save address.");
      return;
    }

    setUser(await response.json());
    setEditingAddress(false);
    setMessage("Address saved.");
  }

  return (
    <div className="profile-page">
      <Navbar />
      <main className="profile-shell">
        <section className="profile-header">
          <div className="profile-avatar">{initials || "SC"}</div>
          <div>
            <p className="profile-eyebrow">My profile</p>
            <h1>{displayName}</h1>
            <p>{currentUser.email}</p>
          </div>
          <span className="profile-role">{valueOrFallback(currentUser.role)}</span>
        </section>

        {message && <p className="profile-message">{message}</p>}

        <section className="profile-grid">
          <article className="profile-panel profile-panel-large">
            <div className="profile-panel-header">
              <h2>Account details</h2>
              {!editingAccount && <button className="profile-secondary-button" type="button" onClick={startAccountEdit}>Edit</button>}
            </div>
            {editingAccount ? (
              <form className="profile-form" onSubmit={saveAccount}>
                <input name="firstName" value={accountForm.firstName} onChange={changeAccount} placeholder="First name" required minLength={2} maxLength={50} pattern={namePattern} autoComplete="given-name" title="Use 2-50 letters." />
                <input name="lastName" value={accountForm.lastName} onChange={changeAccount} placeholder="Last name" required minLength={2} maxLength={50} pattern={namePattern} autoComplete="family-name" title="Use 2-50 letters." />
                <input name="email" type="email" value={accountForm.email} onChange={changeAccount} placeholder="Email" required minLength={6} maxLength={255} pattern={emailPattern} autoComplete="email" title="Enter a valid email address." />
                <div className="profile-form-actions">
                  <button className="profile-primary-button" type="submit" disabled={savingAccount}>{savingAccount ? "Saving..." : "Save account"}</button>
                  <button className="profile-secondary-button" type="button" onClick={() => setEditingAccount(false)}>Cancel</button>
                </div>
              </form>
            ) : (
              <div className="profile-detail-list">
                <DetailRow label="First name" value={valueOrFallback(currentUser.firstName)} />
                <DetailRow label="Last name" value={valueOrFallback(currentUser.lastName)} />
                <DetailRow label="Email" value={valueOrFallback(currentUser.email)} />
                <DetailRow label="Member since" value={formatDate(currentUser.createdAt)} />
              </div>
            )}
          </article>

          <article className="profile-panel">
            <div className="profile-panel-header">
              <h2>Seller score</h2>
            </div>
            <div className="profile-score-grid">
              <div>
                <strong>{currentUser.positiveSellerCount ?? 0}</strong>
                <span>Positive</span>
              </div>
              <div>
                <strong>{currentUser.negativeSellerCount ?? 0}</strong>
                <span>Negative</span>
              </div>
            </div>
          </article>

          <article className="profile-panel">
            <div className="profile-panel-header">
              <h2>Address</h2>
              {!editingAddress && <button className="profile-secondary-button" type="button" onClick={startAddressEdit}>Edit</button>}
            </div>
            {editingAddress ? (
              <form className="profile-form" onSubmit={saveAddress}>
                <input name="phoneNumber" value={addressForm.phoneNumber} onChange={changeAddress} placeholder="Phone number" minLength={7} maxLength={20} pattern={phonePattern} autoComplete="tel" title="Use a valid phone number, for example +31 612345678." />
                <input name="country" value={addressForm.country} onChange={changeAddress} placeholder="Country" required minLength={2} maxLength={255} pattern={textPattern} autoComplete="country-name" title="Use at least 2 letters." />
                <input name="city" value={addressForm.city} onChange={changeAddress} placeholder="City" required minLength={2} maxLength={255} pattern={textPattern} autoComplete="address-level2" title="Use at least 2 letters." />
                <input name="postcode" value={addressForm.postcode} onChange={changeAddress} placeholder="Postcode" required minLength={3} maxLength={12} pattern={postcodePattern} autoComplete="postal-code" title="Use a valid postcode, for example 1234 AB." />
                <input name="streetName" value={addressForm.streetName} onChange={changeAddress} placeholder="Street name" required minLength={2} maxLength={255} pattern={textPattern} autoComplete="street-address" title="Use at least 2 letters." />
                <input name="streetNumber" value={addressForm.streetNumber} onChange={changeAddress} placeholder="Street number" required minLength={1} maxLength={20} pattern={streetNumberPattern} title="Use a valid house number, for example 12A." />
                <div className="profile-form-actions">
                  <button className="profile-primary-button" type="submit" disabled={savingAddress}>{savingAddress ? "Saving..." : "Save address"}</button>
                  <button className="profile-secondary-button" type="button" onClick={() => setEditingAddress(false)}>Cancel</button>
                </div>
              </form>
            ) : (
              <div className="profile-address">
                <p>{valueOrFallback(currentUser.phoneNumber)}</p>
                <p>{valueOrFallback(currentUser.streetName)} {valueOrFallback(currentUser.streetNumber)}</p>
                <p>{valueOrFallback(currentUser.postcode)} {valueOrFallback(currentUser.city)}</p>
                <p>{valueOrFallback(currentUser.country)}</p>
              </div>
            )}
          </article>

          <article className="profile-panel profile-panel-large">
            <div className="profile-panel-header">
              <h2>Quick actions</h2>
            </div>
            <div className="profile-actions">
              <Link to="/cart" className="profile-action-card">
                <strong>View cart</strong>
                <span>Continue shopping or checkout.</span>
              </Link>
              <Link to="/search" className="profile-action-card">
                <strong>Browse products</strong>
                <span>Find new Pokemon cards.</span>
              </Link>
              <Link to="/order-history" className="profile-action-card">
                <strong>Order history</strong>
                <span>View your previous orders.</span>
              </Link>
            </div>
          </article>
        </section>

        <section className="profile-logout-section">
          <button className="profile-logout-button" type="button" onClick={logout}>Logout</button>
        </section>
      </main>
    </div>
  );
}
