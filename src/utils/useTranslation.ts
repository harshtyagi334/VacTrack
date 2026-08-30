import { useAppStore } from '../store';
import { translations } from '../i18n';

export function useTranslation() {
  const language = useAppStore(state => state.language);
  
  const t = (key: keyof typeof translations['en']) => {
    return translations[language][key] || translations['en'][key] || key;
  };

  return { t, language };
}
