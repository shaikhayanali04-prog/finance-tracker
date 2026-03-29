import { NavLink, useNavigate } from "react-router-dom";

const AUTH_KEY = "finance-tracker-auth";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/analytics", label: "Analytics" },
  { to: "/expenses", label: "Expense History" },
  { to: "/settings", label: "Settings" },
];

const getInitials = (name = "User") =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

function Sidebar({ user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem(AUTH_KEY);
    navigate("/login", { replace: true });
  };

  return (
    <aside className="sidebar">
      <div className="brand-card">
        <div className="brand-mark">FT</div>
        <div>
          <p className="eyebrow">Personal Finance</p>
          <h1>Finance Tracker</h1>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `sidebar-link${isActive ? " is-active" : ""}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="profile-chip">
          <div className="avatar-circle">{getInitials(user?.name)}</div>
          <div>
            <strong>{user?.name || "Finance User"}</strong>
            <span>{user?.email || "user@example.com"}</span>
          </div>
        </div>

        <button type="button" className="button button-secondary" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
