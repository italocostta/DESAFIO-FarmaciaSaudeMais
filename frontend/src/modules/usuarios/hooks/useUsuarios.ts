import { useQuery, useMutation, useQueryClient } from 'react-query';
import api from '../../../core/api/axios';

export type Role = 'GERENTE' | 'ATENDENTE' | 'FARMACEUTICO';

export function useUsuarios(page = 1, limit = 20, search = '') {
  return useQuery(['usuarios', page, limit, search], async () => {
    const { data } = await api.get('/auth/users', { params: { page, limit, search } });
    return Array.isArray(data) ? { data, meta: null } : data;
  });
}

export function useCreateUsuario() {
  const qc = useQueryClient();
  return useMutation(
    async (payload: { email: string; password: string; role: Role; funcionarioId: number }) => {
      const { data } = await api.post('/auth/users', payload);
      return data;
    },
    { onSuccess: () => qc.invalidateQueries('usuarios') }
  );
}

export function useDeleteUsuario() {
  const qc = useQueryClient();
  return useMutation(
    async (id: number) => (await api.delete(`/auth/users/${id}`)).data,
    { onSuccess: () => qc.invalidateQueries('usuarios') }
  );
}
