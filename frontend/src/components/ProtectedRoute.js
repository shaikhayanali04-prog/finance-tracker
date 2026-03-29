import { Navigate, useLocation } from "react-router-dom";

const AUTH_KEY = "finance-tracker-auth";

function ProtectedRoute({ children }) {
  const location = useLocation();
  const isAuthenticated = Boolean(localStorage.getItem(AUTH_KEY));

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}

export default ProtectedRoute;
