/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation } from 'react-query';
import api from '../../../core/api/axios';

export function useClientes(page = 1, limit = 10, search = '') {
  return useQuery(['clientes', page, limit, search], async () => {
    const { data } = await api.get('/clientes', { params: { page, limit, search } });
    return data; // { data, meta, links }
  });
}

export function useCliente(id?: string | number) {
  return useQuery(
    ['cliente', id],
    async () => {
      if (!id) return null;
      const { data } = await api.get(`/clientes/${id}`);
      return data;
    },
    { enabled: Boolean(id) }
  );
}

export const useSaveCliente = () =>
  useMutation(async (payload: any & { id?: number }) => {
    const { id, ...body } = payload ?? {};
    if (id) return (await api.patch(`/clientes/${id}`, body)).data;
    return (await api.post('/clientes', body)).data;
  });

export const useDeleteCliente = () =>
  useMutation(async (id: number) => (await api.delete(`/clientes/${id}`)).data);
