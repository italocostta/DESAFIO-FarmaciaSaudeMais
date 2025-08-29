import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';

type Role = 'GERENTE' | 'ATENDENTE' | 'FARMACEUTICO';

export default function RequireRole({
  roles,
  children,
}: {
  roles: Role[];
  children: JSX.Element;
}) {
  const role = useAuthStore((s) => s.role);

  // se não tiver role (ou for diferente do permitido), volta para Home
  if (!role || !roles.includes(role)) {
    return <Navigate to="/" replace />;
  }
  return children;
}
