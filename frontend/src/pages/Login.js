import { Navigate, Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const API_BASE = "http://localhost:8081";
const AUTH_KEY = "finance-tracker-auth";
const PROFILE_KEY = "finance-tracker-profile";

const getStoredProfile = (email) => {
  try {
    const profile = JSON.parse(localStorage.getItem(PROFILE_KEY) || "null");
    if (profile?.email === email) {
      return profile;
    }
  } catch {
    return null;
  }

  return null;
};

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({
    email: location.state?.email || "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (localStorage.getItem(AUTH_KEY)) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const message = await response.text();
      if (!response.ok) {
        throw new Error(message || "Unable to login");
      }

      const profile = getStoredProfile(form.email);
      const derivedName = profile?.name || form.email.split("@")[0] || "Finance User";
      localStorage.setItem(
        AUTH_KEY,
        JSON.stringify({
          email: form.email,
          name: derivedName,
          status: message,
        })
      );

      navigate(location.state?.from || "/dashboard", { replace: true });
    } catch (submitError) {
      setError(submitError.message || "Unable to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <section className="auth-hero panel accent-panel">
        <p className="eyebrow">Personal Finance Tracker</p>
        <h1>Track every rupee with a polished finance workspace.</h1>
        <p>
          Stay on top of daily spending, review your transaction history, and manage your personal finances from one clean dashboard.
        </p>
        <div className="hero-metrics">
          <div>
            <strong>Fast login</strong>
            <span>Connected to your Spring Boot backend</span>
          </div>
          <div>
            <strong>Expense insights</strong>
            <span>Smart totals and recent activity</span>
          </div>
        </div>
      </section>

      <section className="auth-card panel">
        <div className="auth-card-header">
          <p className="eyebrow">Welcome back</p>
          <h2>Login to your workspace</h2>
          <p className="muted-text">Use your registered email and password to continue.</p>
        </div>

        <form className="form-grid" onSubmit={handleSubmit}>
          <label className="form-field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="user@gmail.com"
              required
            />
          </label>

          <label className="form-field">
            <span>Password</span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </label>

          {error ? <div className="alert alert-error">{error}</div> : null}

          <button type="submit" className="button button-primary button-full" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="auth-footer-text">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </section>
    </div>
  );
}

export default Login;
