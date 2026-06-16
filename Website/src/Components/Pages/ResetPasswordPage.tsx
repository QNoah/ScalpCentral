import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../Styling/Auth.css";

type ChangePasswordForm = {
    email: string;
    password: string;
    confirmPassword: string;
};

type AuthInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "name" | "value" | "onChange"> & {
  field: string;
  label: string;
  value: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const emailPattern = "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$";
const passwordPattern = "^(?=.*[A-Za-z])(?=.*\\d).{8,128}$";

export function ResetPasswordPage() {
    const navigate = useNavigate();

    const [form, setForm] = useState<ChangePasswordForm>({
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [error, setError] = useState<Partial<ChangePasswordForm>>({});

    function onChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;

        setForm(prev => ({
            ...prev,
            [name]: value
        }));

        setError(prev => ({
            ...prev,
            [name]: ""
        }));
    }

    function validate() {
        const e: Partial<ChangePasswordForm> = {};

        if (!form.email) e.email = "Required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address";
        if (!form.password) e.password = "Required";
        else if (!new RegExp(passwordPattern).test(form.password)) {
            e.password = "Use at least 8 characters with a letter and a number";
        }

        if (!form.confirmPassword) {
            e.confirmPassword = "Required";
        }
        if (form.password !== form.confirmPassword) {
            e.confirmPassword = "Passwords do not match";
        }

        setError(e);
        return Object.keys(e).length === 0;
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!validate()) return;

        const response = await fetch(
            "http://localhost:5231/api/users/reset-password",
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: form.email,
                    password: form.password
                })
            }
        );

        if (!response.ok) {
            const msg = await response.text();

            setError({
                email: msg || "User not found"
            });

            return;
        }

        navigate("/login");
    }

    return (
        <AuthLayout title="// CHANGE PASSWORD">
            <form onSubmit={onSubmit}>
                <Input
                field="email"
                label="Email"
                value={form.email}
                onChange={onChange}
                error={error.email}
                type="email"
                required
                minLength={6}
                maxLength={255}
                pattern={emailPattern}
                autoComplete="email"
                />

                <Input
                field="password"
                label="Change Password"
                type="password"
                value={form.password}
                onChange={onChange}
                error={error.password}
                required
                minLength={8}
                maxLength={128}
                pattern={passwordPattern}
                autoComplete="new-password"
                />

                <Input
                field="confirmPassword"
                label="Confirm Change Password"
                type="password"
                value={form.confirmPassword}
                onChange={onChange}
                error={error.confirmPassword}
                required
                minLength={8}
                maxLength={128}
                autoComplete="new-password"
                />

                <button className="button">
                    CHANGE PASSWORD
                </button>
            </form>

            <AuthLinks />
        </AuthLayout>
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

/* -------------------- Input -------------------- */
export function Input({
  field,
  label,
  value,
  type = "text",
  error,
  onChange,
  ...inputProps
}: AuthInputProps) {
  return (
    <div>
      <label className="label">{label}</label>

      <input
        name={field}
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

/* -------------------- LINKS -------------------- */
function AuthLinks() {
    return (
        <div className="links">
            <Link to="/login">← Back to login</Link>
            <Link to="/">← Back to home</Link>
        </div>
    );
}
