import { TFunction } from 'react-i18next';

export function translateApiError(t: TFunction, errorMessage: string): string {
  // Try to translate the specific error message
  const translated = t(`apiErrors.${errorMessage}`, { defaultValue: null });
  if (translated) {
    return translated;
  }

  // Fallback to common error messages based on keywords
  if (errorMessage.toLowerCase().includes('network') || errorMessage.toLowerCase().includes('fetch')) {
    return t('apiErrors.Network error');
  }
  if (errorMessage.toLowerCase().includes('server') || errorMessage.toLowerCase().includes('500')) {
    return t('apiErrors.Server error');
  }

  // If no specific translation, return the original message
  return errorMessage;
}