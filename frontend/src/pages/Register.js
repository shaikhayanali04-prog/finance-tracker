import { Link, Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";

const API_BASE = "http://localhost:8081";
const AUTH_KEY = "finance-tracker-auth";
const PROFILE_KEY = "finance-tracker-profile";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
    setSuccess("");

    try {
      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const message = await response.text();
      if (!response.ok) {
        throw new Error(message || "Unable to register");
      }

      localStorage.setItem(
        PROFILE_KEY,
        JSON.stringify({ name: form.name, email: form.email })
      );
      setSuccess(message || "Registration successful");
      setTimeout(() => {
        navigate("/login", { replace: true, state: { email: form.email } });
      }, 1200);
    } catch (submitError) {
      setError(submitError.message || "Unable to register");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell auth-shell-reversed">
      <section className="auth-card panel">
        <div className="auth-card-header">
          <p className="eyebrow">Get started</p>
          <h2>Create your account</h2>
          <p className="muted-text">Register once, then use your dashboard to manage expenses in real time.</p>
        </div>

        <form className="form-grid" onSubmit={handleSubmit}>
          <label className="form-field">
            <span>Name</span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Ayan"
              required
            />
          </label>

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
              placeholder="Choose a secure password"
              required
            />
          </label>

          {error ? <div className="alert alert-error">{error}</div> : null}
          {success ? <div className="alert alert-success">{success}</div> : null}

          <button type="submit" className="button button-primary button-full" disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="auth-footer-text">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </section>

      <section className="auth-hero panel accent-panel">
        <p className="eyebrow">Finance command center</p>
        <h1>Bring your spending history, goals, and daily habits into one premium dashboard.</h1>
        <p>
          Register with your backend-connected account and start tracking expenses with a cleaner workflow from day one.
        </p>
        <div className="hero-metrics">
          <div>
            <strong>Responsive layout</strong>
            <span>Works on laptop, tablet, and mobile</span>
          </div>
          <div>
            <strong>Live backend sync</strong>
            <span>Register and login directly against Spring Boot</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Register;
