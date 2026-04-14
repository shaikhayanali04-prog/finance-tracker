import { Search } from "lucide-react";

function Navbar({ title, subtitle, searchValue, onSearchChange, searchPlaceholder, actions }) {
  return (
    <div className="topbar">
      <div>
        <p className="eyebrow" style={{ color: '#38bdf8' }}>Workspace Dashboard</p>
        <h2>{title}</h2>
        {subtitle ? <p className="muted-text" style={{ maxWidth: '600px' }}>{subtitle}</p> : null}
      </div>

      <div className="topbar-actions">
        {onSearchChange ? (
          <label className="search-field" style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              value={searchValue || ""}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder || "Search..."}
              style={{ paddingLeft: '2.75rem' }}
            />
          </label>
        ) : null}
        
        {actions ? actions : null}
      </div>
    </div>
  );
}

export default Navbar;
