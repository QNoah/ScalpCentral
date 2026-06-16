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
  fName: string;
  lName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const namePattern = "^[A-Za-zÀ-ž\\s'-]{2,50}$";
const passwordPattern = "^(?=.*[A-Za-z])(?=.*\\d).{8,128}$";
const emailPattern = "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$";
const authSuccessDelayMs = 1100;

function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* -------------------- LOGIN -------------------- */
export function LoginPage() {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: ""
  });

  const [error, setError] = useState<Partial<LoginForm>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    setIsSubmitting(true);

    try {
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
      await wait(authSuccessDelayMs);
      navigate("/");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout title="Trainer Login" subtitle="Ready to enter the marketplace?" isLoading={isSubmitting} loadingText="Checking trainer pass...">
      <form onSubmit={onSubmit}>
        <Input name="email" value={form.email} onChange={onChange} error={error.email} required autoComplete="email" />
        <Input name="password" type="password" value={form.password} onChange={onChange} error={error.password} required autoComplete="current-password" />

        <button className="button" disabled={isSubmitting}>{isSubmitting ? "LOGGING IN..." : "LOGIN"}</button>
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
    fName: "",
    lName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState<Partial<RegisterForm>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    if (!form.fName) e.fName = "Required";
    else if (!new RegExp(namePattern).test(form.fName)) e.fName = "Use 2-50 letters";
    if (!form.lName) e.lName = "Required";
    else if (!new RegExp(namePattern).test(form.lName)) e.lName = "Use 2-50 letters";
    if (!form.email) e.email = "Required";
    else if (!emailPatternRegex().test(form.email)) e.email = "Enter a valid email address";
    if (!form.password) e.password = "Required";
    else if (!new RegExp(passwordPattern).test(form.password))
      e.password = "Use at least 8 characters with a letter and a number";
    if (!form.confirmPassword) e.confirmPassword = "Required";
    if (form.password !== form.confirmPassword)
      e.confirmPassword = "Passwords do not match";

    setError(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(
        "http://localhost:5231/api/users/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify({
            FName: form.fName,
            LName: form.lName,
            Email: form.email,
            Password: form.password
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

      await wait(authSuccessDelayMs);
      navigate("/");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout title="Start Your Journey" subtitle="Create a trainer profile and join ScalpCentral." isLoading={isSubmitting} loadingText="Creating trainer card...">
      <div className="requirements">
        <strong>Requirements</strong>
        <span>First and last name: 2-50 letters.</span>
        <span>Email: valid email address.</span>
        <span>Password: at least 8 characters, with a letter and a number.</span>
      </div>

      <form onSubmit={onSubmit}>
        <Input name="fName" value={form.fName} onChange={onChange} error={error.fName} required minLength={2} maxLength={50} pattern={namePattern} autoComplete="given-name" />
        <Input name="lName" value={form.lName} onChange={onChange} error={error.lName} required minLength={2} maxLength={50} pattern={namePattern} autoComplete="family-name" />
        <Input name="email" type="email" value={form.email} onChange={onChange} error={error.email} required minLength={6} maxLength={255} pattern={emailPattern} autoComplete="email" />
        <Input name="password" type="password" value={form.password} onChange={onChange} error={error.password} required minLength={8} maxLength={128} pattern={passwordPattern} autoComplete="new-password" />
        <Input name="confirmPassword" type="password" value={form.confirmPassword} onChange={onChange} error={error.confirmPassword} required minLength={8} maxLength={128} autoComplete="new-password" />

        <button className="button" disabled={isSubmitting}>{isSubmitting ? "CREATING..." : "REGISTER"}</button>
      </form>

      <AuthLinks mode="register" />
    </AuthLayout>
  );
}


/* -------------------- LAYOUT -------------------- */
function AuthLayout({
  title,
  subtitle,
  isLoading,
  loadingText,
  children
}: {
  title: string;
  subtitle: string;
  isLoading: boolean;
  loadingText: string;
  children: React.ReactNode;
}) {
  return (
    <div className="container">
      {isLoading && <AuthLoading text={loadingText} />}
      <div className="box">
        <div className="header">
          <span>{title}</span>
          <small>{subtitle}</small>
        </div>
        <div className="content">{children}</div>
      </div>
    </div>
  );
}

function AuthLoading({ text }: { text: string }) {
  return (
    <div className="auth-loading" role="status" aria-live="polite">
      <div className="auth-loading-card">
        <div className="pokeball pokeball-large" />
        <p>{text}</p>
      </div>
    </div>
  );
}

/* -------------------- Input -------------------- */
export function Input({
  name,
  value,
  type = "text",
  error,
  onChange,
  ...inputProps
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
        {...inputProps}
      />

      {error && <div className="error">{error}</div>}
    </div>
  );
}

function emailPatternRegex() {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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
