import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Wallet, TrendingUp, Filter, List, Target, Settings, Activity, LogOut } from "lucide-react";
import { motion } from "framer-motion";

function Sidebar({ user }) {
  const location = useLocation();

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/income", label: "Income", icon: Wallet },
    { to: "/analytics", label: "Analytics", icon: TrendingUp },
    { to: "/budgets", label: "Budgets", icon: Filter },
    { to: "/goals", label: "Savings Goals", icon: Target },
    { to: "/expenses", label: "Expense History", icon: List },
    { to: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <motion.div 
      className="sidebar"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <div className="brand-card">
        <div className="brand-mark">
          <Activity size={24} />
        </div>
        <div>
          <h1 className="eyebrow" style={{ margin: 0, letterSpacing: '2px', color: '#fff' }}>Trakify</h1>
          <div className="muted-text" style={{ fontSize: '0.8rem' }}>Pro Edition</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const active = location.pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`sidebar-link ${active ? "is-active" : ""}`}
            >
              <Icon size={18} strokeWidth={active ? 2.5 : 1.5} color={active ? '#38bdf8' : '#94a3b8'} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {user ? (
        <div className="profile-chip" style={{ position: 'relative' }}>
          <div className="avatar-circle">
            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <strong style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {user.name || "User"}
            </strong>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user.email}</span>
          </div>
          <button 
            title="Secure Logout"
            className="button button-ghost" 
            style={{ padding: '0.5rem', color: '#ef4444' }}
            onClick={() => {
              localStorage.removeItem("finance-tracker-auth");
              window.location.href = "/";
            }}
          >
            <LogOut size={16} />
          </button>
        </div>
      ) : null}
    </motion.div>
  );
}

export default Sidebar;
