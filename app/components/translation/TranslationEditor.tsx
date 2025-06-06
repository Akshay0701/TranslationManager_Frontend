import { useState, useEffect } from 'react';
import { useTranslationApi } from '../../hooks/useTranslationApi';
import { TranslationKey } from '../../types/translation';
import { useTranslationStore } from '../../store/translationStore';
import { PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface TranslationEditorProps {
  translationKey: TranslationKey;
}

export function TranslationEditor({ translationKey }: TranslationEditorProps) {
  const { updateKey } = useTranslationApi();
  const { selectedLanguage } = useTranslationStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState(
    translationKey.translations[selectedLanguage]?.value || ''
  );

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      
      // Preserve existing translations and only update the selected language
      const updatedTranslations = {
        ...translationKey.translations, // Keep all existing translations
        [selectedLanguage]: { // Update only the selected language
          value: inputValue,
          updated_by: 'frontend_user_1' // TODO: Replace with actual user ID
        }
      };
      
      await updateKey({
        id: translationKey.id,
        data: {
          translations: updatedTranslations
        }
      });
      
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update translation');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setInputValue(translationKey.translations[selectedLanguage]?.value || '');
    setIsEditing(false);
    setError(null);
  };

  // Update input value when selected language changes
  useEffect(() => {
    setInputValue(translationKey.translations[selectedLanguage]?.value || '');
  }, [selectedLanguage, translationKey]);

  if (isEditing) {
    return (
      <div className="space-y-2">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-700 border border-stone-200 dark:border-stone-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-base min-h-[80px] resize-y"
          placeholder={`Enter ${selectedLanguage} translation...`}
          autoFocus
        />
        {error && (
          <div className="text-sm text-error flex items-center gap-1">
            <XMarkIcon className="h-4 w-4" />
            {error}
          </div>
        )}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            <CheckIcon className="h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={handleCancel}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-stone-200 dark:border-stone-600 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-600 transition-colors text-sm"
          >
            <XMarkIcon className="h-4 w-4" />
            Cancel
          </button>
        </div>
      </div>
    );
  }

  const currentTranslation = translationKey.translations[selectedLanguage]?.value || '';
  
  return (
    <div className="group relative">
      <div className="min-h-[40px] px-3 py-2 bg-stone-50 dark:bg-stone-700 rounded-lg">
        {currentTranslation || (
          <span className="text-stone-400 dark:text-stone-500 italic">
            No {selectedLanguage} translation
          </span>
        )}
      </div>
      <button
        onClick={() => setIsEditing(true)}
        className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
      >
        <PencilIcon className="h-4 w-4" />
      </button>
    </div>
  );
} 