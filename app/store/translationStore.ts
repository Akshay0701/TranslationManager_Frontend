import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface TranslationKey {
  id: string;
  key: string;
  category: string;
  description: string | null;
  translations: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export interface TranslationFilters {
  search?: string;
  category?: string;
  offset: number;
  limit: number;
  sortBy?: 'key' | 'category' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

interface TranslationState {
  // Data
  translationKeys: TranslationKey[];
  selectedLanguage: string;
  availableLanguages: string[];
  isLoading: boolean;
  error: Error | null;
  
  // Filters and Pagination
  filters: TranslationFilters;
  totalItems: number;
  
  // UI State
  isAddKeyModalOpen: boolean;
  isDeleteModalOpen: boolean;
  deletingKeyId: string | null;
  selectedKeyId: string | null;
  isSidebarCollapsed: boolean;
  isMobileMenuOpen: boolean;
  
  // Actions
  setTranslationKeys: (keys: TranslationKey[]) => void;
  setSelectedLanguage: (language: string) => void;
  setAvailableLanguages: (languages: string[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: Error | null) => void;
  
  // Filter Actions
  setFilters: (filters: Partial<TranslationFilters>) => void;
  resetFilters: () => void;
  setTotalItems: (total: number) => void;
  
  // UI Actions
  openAddKeyModal: () => void;
  closeAddKeyModal: () => void;
  openDeleteModal: (keyId: string) => void;
  closeDeleteModal: () => void;
  setSelectedKey: (keyId: string | null) => void;
  toggleSidebar: () => void;
  toggleMobileMenu: () => void;
  
  // Translation Actions
  addTranslationKey: (key: Omit<TranslationKey, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateTranslationKey: (id: string, updates: Partial<TranslationKey>) => Promise<void>;
  deleteTranslationKey: (id: string) => Promise<void>;
  updateTranslation: (keyId: string, language: string, value: string) => Promise<void>;
}

const DEFAULT_FILTERS: TranslationFilters = {
  offset: 0,
  limit: 24,
  sortBy: 'updatedAt',
  sortOrder: 'desc'
};

export const useTranslationStore = create<TranslationState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial State
        translationKeys: [],
        selectedLanguage: 'en_US',
        availableLanguages: ['en_US'],
        isLoading: false,
        error: null,
        filters: DEFAULT_FILTERS,
        totalItems: 0,
        isAddKeyModalOpen: false,
        isDeleteModalOpen: false,
        deletingKeyId: null,
        selectedKeyId: null,
        isSidebarCollapsed: false,
        isMobileMenuOpen: false,

        // Data Setters
        setTranslationKeys: (keys) => set({ translationKeys: keys }),
        setSelectedLanguage: (language) => set({ selectedLanguage: language }),
        setAvailableLanguages: (languages) => set({ availableLanguages: languages }),
        setLoading: (isLoading) => set({ isLoading }),
        setError: (error) => set({ error }),
        
        // Filter Actions
        setFilters: (newFilters) => set((state) => ({
          filters: { ...state.filters, ...newFilters, offset: 0 } // Reset offset when filters change
        })),
        resetFilters: () => set({ filters: DEFAULT_FILTERS }),
        setTotalItems: (total) => set({ totalItems: total }),
        
        // UI Actions
        openAddKeyModal: () => set({ isAddKeyModalOpen: true }),
        closeAddKeyModal: () => set({ isAddKeyModalOpen: false }),
        openDeleteModal: (keyId) => set({ isDeleteModalOpen: true, deletingKeyId: keyId }),
        closeDeleteModal: () => set({ isDeleteModalOpen: false, deletingKeyId: null }),
        setSelectedKey: (keyId) => set({ selectedKeyId: keyId }),
        toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
        toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
        
        // Translation Actions
        addTranslationKey: async (key) => {
          try {
            set({ isLoading: true, error: null });
            // API call would go here
            const newKey: TranslationKey = {
              ...key,
              id: crypto.randomUUID(),
              description: key.description || null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
            set((state) => ({
              translationKeys: [...state.translationKeys, newKey],
              totalItems: state.totalItems + 1
            }));
          } catch (error) {
            set({ error: error as Error });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },
        
        updateTranslationKey: async (id, updates) => {
          try {
            set({ isLoading: true, error: null });
            // API call would go here
            set((state) => ({
              translationKeys: state.translationKeys.map((key) =>
                key.id === id
                  ? { ...key, ...updates, updated_at: new Date().toISOString() }
                  : key
              )
            }));
          } catch (error) {
            set({ error: error as Error });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },
        
        deleteTranslationKey: async (id) => {
          try {
            set({ isLoading: true, error: null });
            // API call would go here
            set((state) => ({
              translationKeys: state.translationKeys.filter((key) => key.id !== id),
              totalItems: state.totalItems - 1
            }));
          } catch (error) {
            set({ error: error as Error });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },
        
        updateTranslation: async (keyId, language, value) => {
          try {
            set({ isLoading: true, error: null });
            // API call would go here
            set((state) => ({
              translationKeys: state.translationKeys.map((key) =>
                key.id === keyId
                  ? {
                      ...key,
                      translations: { ...key.translations, [language]: value },
                      updated_at: new Date().toISOString()
                    }
                  : key
              )
            }));
          } catch (error) {
            set({ error: error as Error });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        }
      }),
      {
        name: 'translation-storage',
        partialize: (state) => ({
          selectedLanguage: state.selectedLanguage,
          availableLanguages: state.availableLanguages,
          filters: state.filters,
          isSidebarCollapsed: state.isSidebarCollapsed
        })
      }
    )
  )
); 