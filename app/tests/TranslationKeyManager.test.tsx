import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TranslationKeyManager } from '../components/translation/TranslationKeyManager';
import { useTranslationStore } from '../store/translationStore';
import '../tests/setup';

// Mock the store
const mockUseTranslationStore = useTranslationStore as unknown as jest.Mock;
jest.mock('../store/translationStore', () => ({
  useTranslationStore: jest.fn(),
}));

// Mock the API hook
jest.mock('../hooks/useTranslationApi', () => ({
  useTranslationApi: () => ({
    translationKeys: [
      {
        id: '1',
        key: 'button.save',
        category: 'buttons',
        description: 'Save button text',
        translations: {
          en_US: {
            value: 'Save',
            updated_at: '2024-01-01T00:00:00Z',
            updated_by: 'test_user',
          },
        },
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
    ],
    isLoading: false,
    error: null,
    createKey: jest.fn(),
    deleteKey: jest.fn(),
    updateKey: jest.fn(),
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
  }),
}));

describe('TranslationKeyManager', () => {
  const queryClient = new QueryClient();

  beforeEach(() => {
    // Reset store mock
    mockUseTranslationStore.mockImplementation(() => ({
      filters: { search: '', category: '' },
      setFilters: jest.fn(),
      selectedLanguage: 'en_US',
      setSelectedLanguage: jest.fn(),
      availableLanguages: ['en_US'],
    }));
  });

  it('renders translation keys list', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <TranslationKeyManager />
      </QueryClientProvider>
    );

    expect(screen.getByText('button.save')).toBeInTheDocument();
    expect(screen.getByText('buttons')).toBeInTheDocument();
    expect(screen.getByText('Save button text')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('shows create form when Add Key button is clicked', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <TranslationKeyManager />
      </QueryClientProvider>
    );

    fireEvent.click(screen.getByText('Add Key'));
    expect(screen.getByPlaceholderText('Key (e.g., button.save)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Category (e.g., buttons)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Description (optional)')).toBeInTheDocument();
  });

  it('handles search input', async () => {
    const setFilters = jest.fn();
    mockUseTranslationStore.mockImplementation(() => ({
      filters: { search: '', category: '' },
      setFilters,
      selectedLanguage: 'en_US',
      setSelectedLanguage: jest.fn(),
      availableLanguages: ['en_US'],
    }));

    render(
      <QueryClientProvider client={queryClient}>
        <TranslationKeyManager />
      </QueryClientProvider>
    );

    const searchInput = screen.getByPlaceholderText('Search translation keys...');
    fireEvent.change(searchInput, { target: { value: 'test' } });

    await waitFor(() => {
      expect(setFilters).toHaveBeenCalledWith({ search: 'test', offset: 0 });
    });
  });

  it('handles category filter', async () => {
    const setFilters = jest.fn();
    mockUseTranslationStore.mockImplementation(() => ({
      filters: { search: '', category: '' },
      setFilters,
      selectedLanguage: 'en_US',
      setSelectedLanguage: jest.fn(),
      availableLanguages: ['en_US'],
    }));

    render(
      <QueryClientProvider client={queryClient}>
        <TranslationKeyManager />
      </QueryClientProvider>
    );

    const categorySelect = screen.getByRole('combobox', { name: /category/i });
    fireEvent.change(categorySelect, { target: { value: 'buttons' } });

    await waitFor(() => {
      expect(setFilters).toHaveBeenCalledWith({ category: 'buttons', offset: 0 });
    });
  });
}); 