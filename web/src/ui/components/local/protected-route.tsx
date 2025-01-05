import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../hooks/authProvider";

export const ProtectedRoute: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const { token } = useAuth();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
