import { QueryClient } from 'react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,                 // <-- dados ficam "stale" imediatamente
      refetchOnMount: 'always',     // <-- força refetch ao montar a tela
      refetchOnWindowFocus: false,
      retry: 1,
    },
    mutations: { retry: 0 },
  },
});
