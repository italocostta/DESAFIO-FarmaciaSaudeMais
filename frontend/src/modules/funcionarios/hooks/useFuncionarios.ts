/* eslint-disable @typescript-eslint/no-explicit-any */
// frontend/src/modules/funcionarios/hooks/useFuncionarios.ts
import { useQuery, useMutation } from 'react-query';
import api from '../../../core/api/axios';


export function useFuncionarios(page=1, limit=10, search='') {
  return useQuery(['funcionarios', page, limit, search], async () => {
    const { data } = await api.get('/funcionarios', { params: { page, limit, search } });
    return data;
  });
}

export function useFuncionario(id?: string|number) {
  return useQuery(['funcionario', id], async () => {
    if (!id) return null;
    const { data } = await api.get(`/funcionarios/${id}`);
    return data;
  }, { enabled: Boolean(id) });
}

export const useSaveFuncionario = () =>
  useMutation(async (payload: any & { id?: number }) => {
    const { id, ...body } = payload ?? {};
    if (id) return (await api.patch(`/funcionarios/${id}`, body)).data;
    return (await api.post('/funcionarios', body)).data;
  });

export const useDeleteFuncionario = () =>
  useMutation(async (id: number) => (await api.delete(`/funcionarios/${id}`)).data);
