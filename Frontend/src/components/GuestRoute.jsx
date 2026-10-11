import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/auth";

export default function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="grid min-h-[50vh] place-items-center bg-slate-950 text-white">Checking your session...</div>;
  }

  if (user) {
    const destination = location.state?.from?.pathname || (user.role === "admin" ? "/admin" : "/");
    return <Navigate to={destination} replace />;
  }

  return children;
}
