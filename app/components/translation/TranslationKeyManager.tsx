import { useEffect } from 'react';
import { useTranslationStore } from '../../store/translationStore';
import { useTranslationApi } from '../../hooks/useTranslationApi';
import { 
  TrashIcon,
  XMarkIcon,
  TagIcon,
  PencilSquareIcon,
  ArrowPathIcon,
  InformationCircleIcon,
  ChartBarIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  CommandLineIcon,
  DocumentDuplicateIcon,
  ArrowTopRightOnSquareIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { TranslationEditor } from './TranslationEditor';
import { Tooltip } from '../ui/tooltip';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { EmptyState } from '../ui/empty-state';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { AddKeyModal } from './AddKeyModal';

// Category color mapping
const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  buttons: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800/30' },
  messages: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800/30' },
  errors: { bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-700 dark:text-red-400', border: 'border-red-200 dark:border-red-800/30' },
  labels: { bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-700 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-800/30' },
  titles: { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800/30' },
  placeholders: { bg: 'bg-indigo-50 dark:bg-indigo-900/20', text: 'text-indigo-700 dark:text-indigo-400', border: 'border-indigo-200 dark:border-indigo-800/30' },
  default: { bg: 'bg-stone-50 dark:bg-stone-800/50', text: 'text-stone-700 dark:text-stone-400', border: 'border-stone-200 dark:border-stone-700' }
};

export function TranslationKeyManager() {
  const {
    // Data from API
    translationKeys,
    isLoading,
    error,
    stats,
    
    // Actions from API
    createKey,
    updateKey,
    deleteKey,
    
    // States from API
    isCreating,
    isUpdating,
    isDeleting
  } = useTranslationApi();

  const {
    // Data from Store
    selectedLanguage,
    availableLanguages,
    
    // Filters and Pagination
    filters,
    totalItems,
    
    // UI State
    isAddKeyModalOpen,
    isDeleteModalOpen,
    deletingKeyId,
    
    // Actions
    setFilters,
    openAddKeyModal,
    closeAddKeyModal,
    openDeleteModal,
    closeDeleteModal,
  } = useTranslationStore();

  // Calculate pagination values
  const currentPage = Math.floor(filters.offset / filters.limit) + 1;
  const totalPages = Math.ceil(totalItems / filters.limit);
  const startItem = filters.offset + 1;
  const endItem = Math.min(filters.offset + filters.limit, totalItems);

  // Stats for the header
  const displayStats = {
    totalKeys: translationKeys.length,
    categories: new Set(translationKeys.map(k => k.category)).size,
    languages: availableLanguages.length,
    translatedKeys: translationKeys.filter(k => k.translations[selectedLanguage]?.value).length
  };

  const handleCreateKey = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const key = formData.get('key') as string;
    const category = formData.get('category') as string;
    const description = formData.get('description') as string;

    try {
      await createKey({
        key,
        category,
        description: description || null
      });
      closeAddKeyModal();
    } catch (error) {
      console.error('Failed to create translation key:', error);
    }
  };

  const handleDeleteKey = async () => {
    if (!deletingKeyId) return;
    
    try {
      await deleteKey(deletingKeyId);
      closeDeleteModal();
    } catch (error) {
      console.error('Failed to delete translation key:', error);
    }
  };

  const handlePageChange = (newPage: number) => {
    const newOffset = (newPage - 1) * filters.limit;
    setFilters({ offset: newOffset });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ search: e.target.value });
  };

  const handleCategoryFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ category: e.target.value || undefined });
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    useTranslationStore.getState().setSelectedLanguage(e.target.value);
  };

  const getCategoryStyle = (category: string) => {
    return categoryColors[category.toLowerCase()] || categoryColors.default;
  };

  if (error) {
    return (
      <div className="p-6 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800/30 animate-fade-in">
        <div className="flex items-center gap-3">
          <XMarkIcon className="h-6 w-6" />
          <div>
            <h3 className="font-semibold">Error loading translation keys</h3>
            <p className="text-sm mt-1">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border border-blue-200 dark:border-blue-800/30 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-800/30 rounded-lg">
              <DocumentTextIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-700 dark:text-blue-400">Total Keys</p>
              <p className="text-2xl font-semibold text-blue-900 dark:text-blue-300">{displayStats.totalKeys}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl border border-purple-200 dark:border-purple-800/30 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-800/30 rounded-lg">
              <TagIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-purple-700 dark:text-purple-400">Categories</p>
              <p className="text-2xl font-semibold text-purple-900 dark:text-purple-300">{displayStats.categories}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-xl border border-emerald-200 dark:border-emerald-800/30 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-800/30 rounded-lg">
              <GlobeAltIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Languages</p>
              <p className="text-2xl font-semibold text-emerald-900 dark:text-emerald-300">{displayStats.languages}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-800/20 rounded-xl border border-amber-200 dark:border-amber-800/30 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-800/30 rounded-lg">
              <ChartBarIcon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-amber-700 dark:text-amber-400">Translated</p>
              <p className="text-2xl font-semibold text-amber-900 dark:text-amber-300">{displayStats.translatedKeys}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Key Modal */}
      <AddKeyModal />

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={closeDeleteModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              Delete Translation Key
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this translation key? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={closeDeleteModal}
              className="h-10"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteKey}
              disabled={isDeleting}
              className="h-10"
            >
              {isDeleting ? (
                <>
                  <ArrowPathIcon className="h-4 w-4 animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                'Delete Key'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Translation Keys Table */}
      <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead>
              <tr className="bg-stone-50 dark:bg-stone-800/50">
                <th scope="col" className="py-4 pl-6 pr-3 text-left text-sm font-semibold text-stone-700 dark:text-stone-300">
                  Key
                </th>
                <th scope="col" className="px-3 py-4 text-left text-sm font-semibold text-stone-700 dark:text-stone-300">
                  Category
                </th>
                <th scope="col" className="hidden md:table-cell px-3 py-4 text-left text-sm font-semibold text-stone-700 dark:text-stone-300">
                  Description
                </th>
                <th scope="col" className="px-3 py-4 text-left text-sm font-semibold text-stone-700 dark:text-stone-300">
                  Translation
                </th>
                <th scope="col" className="relative py-4 pl-3 pr-6">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-background">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index} className="animate-pulse">
                    <td className="whitespace-nowrap py-4 pl-6 pr-3">
                      <Skeleton className="h-5 w-[180px]" />
                    </td>
                    <td className="whitespace-nowrap px-3 py-4">
                      <Skeleton className="h-5 w-[100px]" />
                    </td>
                    <td className="hidden md:table-cell whitespace-nowrap px-3 py-4">
                      <Skeleton className="h-5 w-[200px]" />
                    </td>
                    <td className="whitespace-nowrap px-3 py-4">
                      <Skeleton className="h-5 w-[250px]" />
                    </td>
                    <td className="whitespace-nowrap py-4 pl-3 pr-6">
                      <Skeleton className="h-5 w-[80px]" />
                    </td>
                  </tr>
                ))
              ) : translationKeys.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12">
                    <EmptyState
                      icon={<DocumentTextIcon className="h-12 w-12 text-primary-500" />}
                      title="No translation keys found"
                      description="Get started by creating your first translation key"
                      action={
                        <Button 
                          onClick={() => openAddKeyModal()} 
                          size="lg"
                          className="bg-gradient-to-br from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 text-white"
                        >
                          Create Key
                        </Button>
                      }
                    />
                  </td>
                </tr>
              ) : (
                translationKeys.map((key) => {
                  const categoryStyle = getCategoryStyle(key.category);
                  return (
                    <tr key={key.id} className="group hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
                      <td className="py-4 pl-6 pr-3">
                        <div className="flex items-center gap-2">
                          <div className="font-medium text-stone-900 dark:text-stone-100 break-all max-w-[240px] sm:max-w-none truncate">
                            {key.key}
                          </div>
                          {key.description && (
                            <Tooltip content={key.description}>
                              <InformationCircleIcon className="h-4 w-4 text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Tooltip>
                          )}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryStyle.bg} ${categoryStyle.text} ${categoryStyle.border}`}>
                          {key.category}
                        </span>
                      </td>
                      <td className="hidden md:table-cell px-3 py-4">
                        <div className="text-sm text-stone-600 dark:text-stone-400 max-w-xs truncate">
                          {key.description || '—'}
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <TranslationEditor translationKey={key} />
                      </td>
                      <td className="whitespace-nowrap py-4 pl-3 pr-6">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDeleteModal(key.id)}
                          disabled={isDeleteModalOpen && deletingKeyId === key.id}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                        >
                          <TrashIcon className="h-4 w-4" />
                          <span className="ml-2 hidden sm:inline">Delete</span>
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}