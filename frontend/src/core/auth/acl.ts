export type Role = 'GERENTE' | 'ATENDENTE' | 'FARMACEUTICO';

export const visibleMenuByRole: Record<Role, Array<'clientes' | 'funcionarios' | 'remedios' | 'usuarios'>> = {
  GERENTE: ['clientes', 'funcionarios', 'remedios', 'usuarios'],
  FARMACEUTICO: ['clientes', 'remedios'],
  ATENDENTE: ['clientes'],
};

export function menuVisible(role?: Role | null) {
  if (!role) return ['clientes']; // fallback seguro
  return visibleMenuByRole[role];
}
