import { QueryClient } from "@tanstack/react-query"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,       // 5 min — dados frescos, sem refetch desnecessário
      gcTime: 1000 * 60 * 10,         // 10 min — cache removido após inatividade
      refetchOnWindowFocus: false,     // não refetch ao voltar para a aba
      refetchOnReconnect: true,        // refetch ao reconectar à internet
      retry: 1,                        // 1 retry em caso de erro (não sobrecarrega o servidor)
    },
    mutations: {
      retry: 0,                        // mutations não repetem automaticamente
    },
  },
})
