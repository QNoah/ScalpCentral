import { Link } from "react-router-dom";
import Navbar from "../Utils/Navbar";
import { useAuth } from "../Functionalities/AuthContext";
import type { User } from "../Types/User";
import "../Styling/Profile.css";

type ProfileUser = User & Partial<{
  firstName: string;
  lastName: string;
  role: string;
  phoneNumber: string;
  country: string;
  city: string;
  postcode: string;
  streetName: string;
  streetNumber: string;
  positiveSellerCount: number;
  negativeSellerCount: number;
  createdAt: string;
}>;

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

  return date.toLocaleDateString("en-UK").replace(/\//g, '-');
}

function getDisplayName(user: ProfileUser) {
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");
  return fullName || user.name || "ScalpCentral user";
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
  const { user } = useAuth();
  const profileUser = user as ProfileUser | null;

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

  const displayName = getDisplayName(profileUser);
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0])
    .join("")
    .toUpperCase();

  return (
    <div className="profile-page">
      <Navbar />
      <main className="profile-shell">
        <section className="profile-header">
          <div className="profile-avatar">{initials || "SC"}</div>
          <div>
            <p className="profile-eyebrow">My profile</p>
            <h1>{displayName}</h1>
            <p>{profileUser.email}</p>
          </div>
          <span className="profile-role">{valueOrFallback(profileUser.role)}</span>
        </section>

        <section className="profile-grid">
          <article className="profile-panel profile-panel-large">
            <div className="profile-panel-header">
              <h2>Account details</h2>
              <button className="profile-secondary-button" type="button" disabled>Edit later</button>
            </div>
            <div className="profile-detail-list">
              <DetailRow label="First name" value={valueOrFallback(profileUser.firstName)} />
              <DetailRow label="Last name" value={valueOrFallback(profileUser.lastName)} />
              <DetailRow label="Email" value={valueOrFallback(profileUser.email)} />
              <DetailRow label="Phone" value={valueOrFallback(profileUser.phoneNumber)} />
              <DetailRow label="Member since" value={formatDate(profileUser.createdAt)} />
            </div>
          </article>

          <article className="profile-panel">
            <div className="profile-panel-header">
              <h2>Seller score</h2>
            </div>
            <div className="profile-score-grid">
              <div>
                <strong>{profileUser.positiveSellerCount ?? 0}</strong>
                <span>Positive</span>
              </div>
              <div>
                <strong>{profileUser.negativeSellerCount ?? 0}</strong>
                <span>Negative</span>
              </div>
            </div>
          </article>

          <article className="profile-panel">
            <div className="profile-panel-header">
              <h2>Address</h2>
              <button className="profile-secondary-button" type="button" disabled>Edit later</button>
            </div>
            <div className="profile-address">
              <p>{valueOrFallback(profileUser.streetName)} {valueOrFallback(profileUser.streetNumber)}</p>
              <p>{valueOrFallback(profileUser.postcode)} {valueOrFallback(profileUser.city)}</p>
              <p>{valueOrFallback(profileUser.country)}</p>
            </div>
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
      </main>
    </div>
  );
}
