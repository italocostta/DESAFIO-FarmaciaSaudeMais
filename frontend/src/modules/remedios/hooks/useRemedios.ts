/* eslint-disable @typescript-eslint/no-explicit-any */
// frontend/src/modules/remedios/hooks/useRemedios.ts
import { useQuery, useMutation } from 'react-query';
import api from '../../../core/api/axios';

export function useRemedios(page=1, limit=10, search='') {
  return useQuery(['remedios', page, limit, search], async () => {
    const { data } = await api.get('/remedios', { params: { page, limit, search } });
    return data;
  });
}

export function useRemedio(id?: string|number) {
  return useQuery(['remedio', id], async () => {
    if (!id) return null;
    const { data } = await api.get(`/remedios/${id}`);
    return data;
  }, { enabled: Boolean(id) });
}

export const useSaveRemedio = () =>
  useMutation(async (payload: any & { id?: number }) => {
    const { id, ...body } = payload ?? {};
    if (id) return (await api.patch(`/remedios/${id}`, body)).data;
    return (await api.post('/remedios', body)).data;
  });

export const useDeleteRemedio = () =>
  useMutation(async (id: number) => (await api.delete(`/remedios/${id}`)).data);
