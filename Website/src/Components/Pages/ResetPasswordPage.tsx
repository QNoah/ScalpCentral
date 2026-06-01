import { useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import "../Styling/Auth.css";

type ChangePasswordForm = {
    email: string;
    password: string;
    confirmPassword: string;
};

export function ChangePasswordPage() {
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

        if (!form.email)
            e.email = "Required";

        if (!form.password)
            e.password = "Required";

        if (form.password !== form.confirmPassword)
            e.confirmPassword = "Passwords do not match";

        setError(e);

        return Object.keys(e).length === 0;
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!validate())
            return;

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
            setError({
                email: "User not found"
            });

            return;
        }

        navigate("/login");
    }

    return (
        <AuthLayout title="// CHANGE PASSWORD">
            <form onSubmit={onSubmit}>
                <Input
                    name="email"
                    value={form.email}
                    onChange={onChange}
                    error={error.email}
                />

                <Input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={onChange}
                    error={error.password}
                />

                <Input
                    name="confirmPassword"
                    type="password"
                    value={form.confirmPassword}
                    onChange={onChange}
                    error={error.confirmPassword}
                />

                <button className="button">
                    CHANGE PASSWORD
                </button>
            </form>

            <AuthLinks mode="register" />
        </AuthLayout>
    );

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
}