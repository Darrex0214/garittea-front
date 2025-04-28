import { ReactNode, useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import api from 'src/api/client';

interface PrivateRouteProps {
  children: ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const [checking, setChecking] = useState(true);
  const [ok, setOk] = useState(false);
  const location = useLocation();

  useEffect(() => {
    api.get('/auth/me')
      .then(() => setOk(true))
      .catch(() => setOk(false))
      .finally(() => setChecking(false));
  }, []);

  if (checking) {
    return null; // o un spinner
  }

  return ok
    ? <>{children}</>
    : <Navigate to="/sign-in" state={{ from: location }} replace />;
}