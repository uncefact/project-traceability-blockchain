import i18n from 'i18next';
import translationEN from './en/translation.json';
import { initReactI18next } from 'react-i18next';

const resources = {
    "en": {
        translation: translationEN,
    },
} as const;

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'en',
        fallbackLng: "en",
        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        },
});

export default i18n;
