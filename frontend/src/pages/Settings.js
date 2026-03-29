import { useMemo } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const AUTH_KEY = "finance-tracker-auth";

const getAuthUser = () => {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY) || "null");
  } catch {
    return null;
  }
};

function Settings() {
  const user = getAuthUser();

  const profile = useMemo(
    () => ({
      name: user?.name || "Finance User",
      email: user?.email || "user@example.com",
      plan: "Personal",
      workspace: "Primary tracker",
    }),
    [user]
  );

  return (
    <div className="app-shell">
      <Sidebar user={user} />

      <div className="page-shell">
        <Navbar
          title="Settings & Profile"
          subtitle="Review your stored account details and keep your workspace preferences in one place."
          actions={<span className="panel-badge">Client-side auth active</span>}
        />

        <div className="settings-grid">
          <section className="panel profile-panel">
            <div className="profile-header">
              <div className="avatar-circle avatar-large">
                {profile.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div>
                <p className="eyebrow">Profile</p>
                <h3>{profile.name}</h3>
                <p className="muted-text">{profile.email}</p>
              </div>
            </div>

            <div className="detail-list">
              <div>
                <span>Plan</span>
                <strong>{profile.plan}</strong>
              </div>
              <div>
                <span>Workspace</span>
                <strong>{profile.workspace}</strong>
              </div>
              <div>
                <span>Status</span>
                <strong>Active</strong>
              </div>
            </div>
          </section>

          <section className="panel">
            <p className="eyebrow">Preferences</p>
            <h3>Workspace settings</h3>
            <div className="settings-list">
              <div className="setting-row">
                <div>
                  <strong>Email summaries</strong>
                  <span>Keep weekly finance snapshots enabled for review.</span>
                </div>
                <span className="status-pill is-on">Enabled</span>
              </div>
              <div className="setting-row">
                <div>
                  <strong>Expense alerts</strong>
                  <span>Highlight unusual spending patterns on the dashboard.</span>
                </div>
                <span className="status-pill is-on">Enabled</span>
              </div>
              <div className="setting-row">
                <div>
                  <strong>Theme</strong>
                  <span>Light SaaS layout tuned for everyday finance work.</span>
                </div>
                <span className="status-pill">Light</span>
              </div>
            </div>
          </section>

          <section className="panel accent-panel">
            <p className="eyebrow">Security</p>
            <h3>Protected pages stay behind local login state.</h3>
            <p>
              Your current backend login returns plain text, so this frontend stores the authenticated session in localStorage to preserve access across refreshes.
            </p>
            <p className="muted-text">
              When you upgrade the backend to return a JWT or session token, this page is ready for that next step.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Settings;
