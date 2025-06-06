import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useTranslationApi } from '../../hooks/useTranslationApi';
import { useTranslationStore } from '../../store/translationStore';
import { CreateTranslationKeyRequest } from '../../types/translation';

export function AddKeyModal() {
  const [formData, setFormData] = useState<CreateTranslationKeyRequest>({
    key: '',
    category: '',
    description: null
  });
  const [error, setError] = useState<string | null>(null);

  // Get actions from the API hook
  const { createKey, isCreating } = useTranslationApi();
  
  // Get UI state from the store
  const { isAddKeyModalOpen, closeAddKeyModal } = useTranslationStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.key || !formData.category) {
      setError('Key and category are required');
      return;
    }

    try {
      await createKey({
        key: formData.key,
        category: formData.category,
        description: formData.description || null
      });
      
      // Reset form and close modal
      setFormData({ key: '', category: '', description: null });
      closeAddKeyModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create translation key');
    }
  };

  const handleClose = () => {
    setFormData({ key: '', category: '', description: null });
    setError(null);
    closeAddKeyModal();
  };

  return (
    <Transition appear show={isAddKeyModalOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 dark:bg-black/40" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-stone-800 p-6 shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title as="h3" className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                    Add New Translation Key
                  </Dialog.Title>
                  <button
                    onClick={handleClose}
                    className="text-stone-400 hover:text-stone-500 dark:hover:text-stone-300 transition-colors"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  <div>
                    <label htmlFor="key" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                      Translation Key *
                    </label>
                    <input
                      type="text"
                      id="key"
                      value={formData.key}
                      onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                      placeholder="e.g., button.save, welcome.message"
                      className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-700 border border-stone-200 dark:border-stone-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                      Category *
                    </label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-700 border border-stone-200 dark:border-stone-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      required
                    >
                      <option value="">Select a category</option>
                      <option value="buttons">Buttons</option>
                      <option value="messages">Messages</option>
                      <option value="errors">Errors</option>
                      <option value="labels">Labels</option>
                      <option value="titles">Titles</option>
                      <option value="placeholders">Placeholders</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                      Description (Optional)
                    </label>
                    <textarea
                      id="description"
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value || null })}
                      placeholder="Add a description to help translators understand the context"
                      className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-700 border border-stone-200 dark:border-stone-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="px-4 py-2 text-sm font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isCreating}
                      className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isCreating ? 'Creating...' : 'Create Key'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
} 