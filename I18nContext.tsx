import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'es' | 'fr';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used within I18nProvider');
  return context;
};

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string) => {
    const keys = key.split('.');
    let value: any = translations[language];
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

const translations: Record<Language, any> = {
  en: {
    nav: { home: 'Home', charters: 'Charters', destinations: 'Destinations', about: 'About', contact: 'Contact' },
    hero: { title: 'Discover Your Perfect Charter Adventure', subtitle: 'Explore luxury yacht charters worldwide', cta: 'Explore Charters' },
    search: { placeholder: 'Search destinations...', filter: 'Filter', sort: 'Sort by', price: 'Price', rating: 'Rating' },
    charter: { perDay: 'per day', guests: 'guests', viewDetails: 'View Details', bookNow: 'Book Now' },
    booking: { title: 'Book Your Charter', selectDates: 'Select Dates', guests: 'Number of Guests', total: 'Total', confirm: 'Confirm Booking' },
    dashboard: { title: 'My Dashboard', bookings: 'My Bookings', profile: 'Profile', referrals: 'Referrals' },
    footer: { rights: 'All rights reserved', company: 'Company', support: 'Support', legal: 'Legal' }
  },
  es: {
    nav: { home: 'Inicio', charters: 'Charters', destinations: 'Destinos', about: 'Acerca de', contact: 'Contacto' },
    hero: { title: 'Descubre Tu Aventura Charter Perfecta', subtitle: 'Explora charters de yates de lujo en todo el mundo', cta: 'Explorar Charters' },
    search: { placeholder: 'Buscar destinos...', filter: 'Filtrar', sort: 'Ordenar por', price: 'Precio', rating: 'Calificación' },
    charter: { perDay: 'por día', guests: 'huéspedes', viewDetails: 'Ver Detalles', bookNow: 'Reservar Ahora' },
    booking: { title: 'Reserva Tu Charter', selectDates: 'Seleccionar Fechas', guests: 'Número de Huéspedes', total: 'Total', confirm: 'Confirmar Reserva' },
    dashboard: { title: 'Mi Panel', bookings: 'Mis Reservas', profile: 'Perfil', referrals: 'Referencias' },
    footer: { rights: 'Todos los derechos reservados', company: 'Empresa', support: 'Soporte', legal: 'Legal' }
  },
  fr: {
    nav: { home: 'Accueil', charters: 'Charters', destinations: 'Destinations', about: 'À propos', contact: 'Contact' },
    hero: { title: 'Découvrez Votre Aventure Charter Parfaite', subtitle: 'Explorez les charters de yachts de luxe dans le monde entier', cta: 'Explorer les Charters' },
    search: { placeholder: 'Rechercher des destinations...', filter: 'Filtrer', sort: 'Trier par', price: 'Prix', rating: 'Évaluation' },
    charter: { perDay: 'par jour', guests: 'invités', viewDetails: 'Voir Détails', bookNow: 'Réserver Maintenant' },
    booking: { title: 'Réservez Votre Charter', selectDates: 'Sélectionner les Dates', guests: 'Nombre d\'Invités', total: 'Total', confirm: 'Confirmer la Réservation' },
    dashboard: { title: 'Mon Tableau de Bord', bookings: 'Mes Réservations', profile: 'Profil', referrals: 'Parrainages' },
    footer: { rights: 'Tous droits réservés', company: 'Entreprise', support: 'Assistance', legal: 'Juridique' }
  }
};
