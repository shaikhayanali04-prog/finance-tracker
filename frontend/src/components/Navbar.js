function Navbar({
  title,
  subtitle,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search",
  actions,
}) {
  return (
    <header className="topbar panel">
      <div className="topbar-copy">
        <p className="eyebrow">Overview</p>
        <h2>{title}</h2>
        {subtitle ? <p className="muted-text">{subtitle}</p> : null}
      </div>

      <div className="topbar-actions">
        {onSearchChange ? (
          <label className="search-field">
            <span>Search</span>
            <input
              type="text"
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder={searchPlaceholder}
            />
          </label>
        ) : null}
        {actions}
      </div>
    </header>
  );
}

export default Navbar;
