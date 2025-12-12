import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const { t, i18n } = useTranslation('common');

  const toggleLanguage = useCallback(() => {
    const next = i18n.language?.startsWith('vi') ? 'en' : 'vi';
    i18n.changeLanguage(next);
  }, [i18n]);

  const dictionary = useMemo(
    () => ({
      nav: t('nav', { returnObjects: true }),
      languageToggle: t('languageToggle', { returnObjects: true }),
      slides: t('slides', { returnObjects: true }),
      translationPage: t('translationPage', { returnObjects: true })
    }),
    [t, i18n.language]
  );

  const value = useMemo(
    () => ({
      language: i18n.language || 'vi',
      toggleLanguage,
      dictionary,
      t,
    }),
    [i18n.language, toggleLanguage, dictionary, t],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

