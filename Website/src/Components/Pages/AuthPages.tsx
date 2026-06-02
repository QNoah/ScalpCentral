import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../Functionalities/AuthContext";
import "../Styling/Auth.css";

/* -------------------- TYPES -------------------- */
type LoginForm = {
  email: string;
  password: string;
};

type RegisterForm = {
  email: string;
  password: string;
  confirmPassword: string;
};

/* -------------------- LOGIN -------------------- */
export function LoginPage() {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: ""
  });

  const [error, setError] = useState<Partial<LoginForm>>({});

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setForm(p => ({
      ...p,
      [name as keyof LoginForm]: value
    }));

    setError(p => ({
      ...p,
      [name as keyof LoginForm]: ""
    }));
  }

  function validate() {
    const e: Partial<LoginForm> = {};

    if (!form.email) e.email = "Required";
    if (!form.password) e.password = "Required";

    setError(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validate()) return;

    const response = await fetch(
      "http://localhost:5231/api/users/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          email: form.email,
          password: form.password
        })
      }
    );

    if (!response.ok) {
      setError({
        password: "Invalid email or password"
      });

      return;
    }

    const user = await response.json();
    setUser(user);
    navigate("/");
  }

  return (
    <AuthLayout title="// LOGIN">
      <form onSubmit={onSubmit}>
        <Input name="email" value={form.email} onChange={onChange} error={error.email} />
        <Input name="password" type="password" value={form.password} onChange={onChange} error={error.password} />

        <button className="button">LOGIN</button>
      </form>

      <AuthLinks mode="login" />
    </AuthLayout>
  );
}

/* -------------------- REGISTER -------------------- */
export function RegisterPage() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterForm>({
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState<Partial<RegisterForm>>({});

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setForm(p => ({
      ...p,
      [name as keyof RegisterForm]: value
    }));

    setError(p => ({
      ...p,
      [name as keyof RegisterForm]: ""
    }));
  }

  function validate() {
    const e: Partial<RegisterForm> = {};

    if (!form.email) e.email = "Required";
    if (!form.password) e.password = "Required";
    if (form.password !== form.confirmPassword)
      e.confirmPassword = "Passwords do not match";

    setError(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validate()) return;

    const response = await fetch(
      "http://localhost:5231/api/users/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          email: form.email,
          password: form.password
        })
      }
    );

    if (!response.ok) {
      setError({
        email: "Could not create account"
      });

      return;
    }

    const user = await response.json();
    setUser(user);

    navigate("/");
  }

  return (
    <AuthLayout title="// REGISTER">
      <form onSubmit={onSubmit}>
        <Input name="email" value={form.email} onChange={onChange} error={error.email} />
        <Input name="password" type="password" value={form.password} onChange={onChange} error={error.password} />
        <Input name="confirmPassword" type="password" value={form.confirmPassword} onChange={onChange} error={error.confirmPassword} />

        <button className="button">REGISTER</button>
      </form>

      <AuthLinks mode="register" />
    </AuthLayout>
  );
}

/* -------------------- SHARED UI -------------------- */
function Input({
  name,
  value,
  type = "text",
  error,
  onChange
}: any) {
  return (
    <div>
      <label className="label">{name.toUpperCase()}</label>

      <input
        name={name}
        value={value}
        type={type}
        onChange={onChange}
        className="input"
      />

      {error && <div className="error">{error}</div>}
    </div>
  );
}

/* -------------------- LAYOUT -------------------- */
function AuthLayout({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="container">
      <div className="box">
        <div className="header">{title}</div>
        <div className="content">{children}</div>
      </div>
    </div>
  );
}

/* -------------------- LINKS -------------------- */
function AuthLinks({ mode }: { mode: "login" | "register" }) {
  return (
    <div className="links">
      {mode === "login" ? (
        <>
          <Link to="/register">No account? Register</Link>
          <Link to="/reset-password">Forgot password?</Link>
        </>
      ) : (
        <Link to="/login">Already have an account? Login</Link>
      )}

      <Link to="/">← Back to home</Link>
    </div>
  );
}