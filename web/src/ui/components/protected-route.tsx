import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/authProvider";

export const ProtectedRoute: React.FC<React.PropsWithChildren> = () => {
  const { token } = useAuth();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
