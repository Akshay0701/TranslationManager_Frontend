import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TranslationKey, CreateTranslationKeyRequest, UpdateTranslationKeyRequest, TranslationStats } from '../types/translation';
import { useTranslationStore } from '../store/translationStore';

const API_BASE_URL = 'http://18.218.17.244:8000';

// Query keys
export const translationKeys = {
  all: ['translationKeys'] as const,
  lists: () => [...translationKeys.all, 'list'] as const,
  list: (filters: any) => [...translationKeys.lists(), filters] as const,
  details: () => [...translationKeys.all, 'detail'] as const,
  detail: (id: string) => [...translationKeys.details(), id] as const,
  stats: () => [...translationKeys.all, 'stats'] as const,
};

// API functions
async function fetchTranslationKeys(filters: any): Promise<TranslationKey[]> {
  try {
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.search) params.append('search', filters.search);
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.offset) params.append('offset', filters.offset.toString());

    const url = `${API_BASE_URL}/translation-keys?${params}`;
    console.log('Fetching translation keys from:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Failed to fetch translation keys: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('Received data:', data);
    return data;
  } catch (error) {
    console.error('Error in fetchTranslationKeys:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to fetch translation keys: ${error.message}`);
    }
    throw error;
  }
}

async function fetchTranslationKey(id: string): Promise<TranslationKey> {
  const response = await fetch(`${API_BASE_URL}/translation-keys/${id}`);
  if (!response.ok) throw new Error('Failed to fetch translation key');
  return response.json();
}

async function createTranslationKey(data: CreateTranslationKeyRequest): Promise<TranslationKey> {
  const response = await fetch(`${API_BASE_URL}/translation-keys`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create translation key');
  return response.json();
}

async function updateTranslationKey(id: string, data: UpdateTranslationKeyRequest): Promise<TranslationKey> {
  const response = await fetch(`${API_BASE_URL}/translation-keys/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update translation key');
  return response.json();
}

async function deleteTranslationKey(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/translation-keys/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete translation key');
}

async function fetchTranslationStats(): Promise<TranslationStats> {
  try {
    const url = `${API_BASE_URL}/translation-keys/stats/completion`;
    console.log('Fetching translation stats from:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    console.log('Stats response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.warn('Failed to fetch translation stats:', errorText);
      return {};
    }

    const data = await response.json();
    console.log('Received stats:', data);
    return data;
  } catch (error) {
    console.error('Error in fetchTranslationStats:', error);
    return {};
  }
}

// Custom hook
export function useTranslationApi() {
  const queryClient = useQueryClient();
  const filters = useTranslationStore((state) => state.filters);

  // Queries
  const translationKeysQuery = useQuery({
    queryKey: translationKeys.list(filters),
    queryFn: () => fetchTranslationKeys(filters),
    retry: 1,
  });

  const translationStatsQuery = useQuery({
    queryKey: translationKeys.stats(),
    queryFn: fetchTranslationStats,
    retry: false,
    staleTime: 30000,
  });

  // Mutations
  const createKeyMutation = useMutation({
    mutationFn: createTranslationKey,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: translationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: translationKeys.stats() });
    },
  });

  const updateKeyMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTranslationKeyRequest }) =>
      updateTranslationKey(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: translationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: translationKeys.stats() });
    },
  });

  const deleteKeyMutation = useMutation({
    mutationFn: deleteTranslationKey,
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData(
        translationKeys.list(filters),
        (oldData: TranslationKey[] | undefined) => {
          if (!oldData) return [];
          return oldData.filter(key => key.id !== deletedId);
        }
      );
      
      queryClient.invalidateQueries({ queryKey: translationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: translationKeys.stats() });
    },
  });

  return {
    // Queries
    translationKeys: translationKeysQuery.data ?? [],
    isLoading: translationKeysQuery.isLoading,
    error: translationKeysQuery.error,
    stats: translationStatsQuery.data ?? {},
    statsError: translationStatsQuery.error,
    
    // Mutations
    createKey: createKeyMutation.mutate,
    updateKey: updateKeyMutation.mutate,
    deleteKey: (id: string) => deleteKeyMutation.mutate(id, {
      onError: (error) => {
        console.error('Failed to delete translation key:', error);
        queryClient.invalidateQueries({ queryKey: translationKeys.lists() });
      }
    }),
    
    // Mutation states
    isCreating: createKeyMutation.isPending,
    isUpdating: updateKeyMutation.isPending,
    isDeleting: deleteKeyMutation.isPending,
  };
} 