import { Navigate, useLocation } from 'react-router-dom';

export default function RequireAuth({ children }: { children: JSX.Element }) {
  // Checa se existe token (sessão)
  const token = localStorage.getItem('saudemais_token');
  const loc = useLocation();

  if (!token) {
    // guarda a rota atual para voltar após login
    return <Navigate to="/login" state={{ from: loc.pathname }} replace />;
  }
  return children;
}
