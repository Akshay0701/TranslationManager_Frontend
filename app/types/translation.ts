export interface Translation {
  value: string;
  updated_at: string;
  updated_by: string;
}

export interface TranslationKey {
  id: string;
  key: string;
  category: string;
  description: string | null;
  translations: {
    [languageCode: string]: Translation;
  };
  created_at: string;
  updated_at: string;
}

export interface TranslationStats {
  [languageCode: string]: number; // completion percentage
}

export interface TranslationKeyFilters {
  category?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface CreateTranslationKeyRequest {
  key: string;
  category: string;
  description?: string | null;
}

export interface UpdateTranslationKeyRequest {
  key?: string;
  category?: string;
  description?: string | null;
  translations?: {
    [languageCode: string]: {
      value: string;
      updated_by: string;
    };
  };
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
} 