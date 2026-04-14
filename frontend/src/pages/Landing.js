import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Activity, PieChart, Target, ShieldCheck } from "lucide-react";
import "../styles/landing.css";

function Landing() {
  return (
    <div className="landing-root">
      {/* Background Orbs for Depth */}
      <div className="orb-1"></div>
      <div className="orb-2"></div>
      <div className="orb-3"></div>

      <nav className="landing-nav">
        <div className="brand-logo">
          <Activity size={28} color="#38bdf8" />
          Trakify Pro
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Link to="/login" className="btn btn-ghost">Sign In</Link>
          <Link to="/register" className="btn btn-primary">Get Started</Link>
        </div>
      </nav>

      <main className="hero-section">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
        >
          <div style={{ marginBottom: "1.5rem", padding: "0.5rem 1rem", background: "rgba(56, 189, 248, 0.1)", border: "1px solid rgba(56, 189, 248, 0.2)", borderRadius: "99px", color: "#38bdf8", fontWeight: 600, fontSize: "0.85rem" }}>
            v2.0 Premium Edition Released
          </div>
          <h1 className="hero-title">
            Financial clarity, <br />
            <span>engineered for you.</span>
          </h1>
          <p className="hero-subtitle">
            Experience a world-class financial control center. Track expenses, monitor live budget thresholds, and analyze income streams with a premium, frictionless UI.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary" style={{ padding: "1rem 2.5rem", fontSize: "1.1rem" }}>
              Start Tracking Free
            </Link>
            <Link to="/login" className="btn btn-ghost" style={{ padding: "1rem 2.5rem", fontSize: "1.1rem", border: "1px solid rgba(255,255,255,0.1)" }}>
              Access Portal
            </Link>
          </div>
        </motion.div>

        {/* 3D Floating Features Showcase */}
        <div className="showcase-grid">
          <motion.div 
            className="glass-card-3d"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            whileHover={{ y: -10, rotateX: 5, rotateY: -5, boxShadow: "0 30px 60px -15px rgba(56,189,248,0.3)" }}
          >
            <div className="card-icon" style={{ background: "rgba(56, 189, 248, 0.15)", color: "#38bdf8" }}>
              <PieChart size={28} />
            </div>
            <h3>Intelligent Analytics</h3>
            <p>Interactive charting and visual cash-flow health. Instantly see where every unit of currency is distributed.</p>
          </motion.div>

          <motion.div 
            className="glass-card-3d"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            whileHover={{ y: -10, rotateX: 5, rotateY: 0, boxShadow: "0 30px 60px -15px rgba(16,185,129,0.3)" }}
            style={{ transform: "translateZ(30px)" }}
          >
            <div className="card-icon" style={{ background: "rgba(16, 185, 129, 0.15)", color: "#10b981" }}>
              <Target size={28} />
            </div>
            <h3>Dynamic Budgets</h3>
            <p>Set stringent limits. Watch our real-time 3D progress bars fill up so you never cross your categorical thresholds.</p>
          </motion.div>

          <motion.div 
            className="glass-card-3d"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            whileHover={{ y: -10, rotateX: 5, rotateY: 5, boxShadow: "0 30px 60px -15px rgba(99,102,241,0.3)" }}
          >
            <div className="card-icon" style={{ background: "rgba(99, 102, 241, 0.15)", color: "#818cf8" }}>
              <ShieldCheck size={28} />
            </div>
            <h3>Bank-Grade Security</h3>
            <p>Connecting seamlessly to localized architectures. Protected, reliable, and entirely yours.</p>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

export default Landing;
