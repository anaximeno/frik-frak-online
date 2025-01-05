import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/authProvider";

export const ProtectedRoute: React.FC<React.PropsWithChildren> = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return (
      <Navigate
        to={`/login?next=${location.pathname}`}
        state={{ from: location }}
        replace
      />
    );
  }

  return <Outlet />;
};
