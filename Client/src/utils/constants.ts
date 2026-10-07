export const FEATURED_CITIES = ["Douala", "Yaoundé", "Kribi", "Limbe"];

export interface RegionItem {
  id: string;
  en: string;
  fr: string;
}

export const CAMEROON_REGIONS: RegionItem[] = [
  { id: 'Centre', en: 'Centre (Yaoundé, Mbalmayo...)', fr: 'Centre (Yaoundé, Mbalmayo...)' },
  { id: 'Littoral', en: 'Littoral (Douala, Edéa...)', fr: 'Littoral (Douala, Edéa...)' },
  { id: 'Ouest', en: 'West / Ouest (Bafoussam, Dschang...)', fr: 'Ouest (Bafoussam, Dschang...)' },
  { id: 'Sud-Ouest', en: 'South-West (Buea, Limbe, Kumba...)', fr: 'Sud-Ouest (Buea, Limbe, Kumba...)' },
  { id: 'Nord-Ouest', en: 'North-West (Bamenda...)', fr: 'Nord-Ouest (Bamenda...)' },
  { id: 'Sud', en: 'South / Sud (Kribi, Ebolowa...)', fr: 'Sud (Kribi, Ebolowa...)' },
  { id: 'Adamaoua', en: 'Adamawa / Adamaoua (Ngaoundéré...)', fr: 'Adamaoua (Ngaoundéré...)' },
  { id: 'Nord', en: 'North / Nord (Garoua...)', fr: 'Nord (Garoua...)' },
  { id: 'Extreme-Nord', en: 'Far North / Extrême-Nord (Maroua...)', fr: 'Extrême-Nord (Maroua...)' },
  { id: 'Est', en: 'East / Est (Bertoua...)', fr: 'Est (Bertoua...)' },
];

export interface CountryItem {
  code: string;
  nameEn: string;
  nameFr: string;
  flag: string;
}

export const COUNTRIES_LIST: CountryItem[] = [
  { code: 'CM', nameEn: 'Cameroon', nameFr: 'Cameroun', flag: '🇨🇲' },
  { code: 'FR', nameEn: 'France', nameFr: 'France', flag: '🇫🇷' },
  { code: 'US', nameEn: 'United States', nameFr: 'États-Unis', flag: '🇺🇸' },
  { code: 'CA', nameEn: 'Canada', nameFr: 'Canada', flag: '🇨🇦' },
  { code: 'GB', nameEn: 'United Kingdom', nameFr: 'Royaume-Uni', flag: '🇬🇧' },
  { code: 'BE', nameEn: 'Belgium', nameFr: 'Belgique', flag: '🇧🇪' },
  { code: 'DE', nameEn: 'Germany', nameFr: 'Allemagne', flag: '🇩🇪' },
  { code: 'IT', nameEn: 'Italy', nameFr: 'Italie', flag: '🇮🇹' },
  { code: 'CH', nameEn: 'Switzerland', nameFr: 'Suisse', flag: '🇨🇭' },
  { code: 'ES', nameEn: 'Spain', nameFr: 'Espagne', flag: '🇪🇸' },
  { code: 'AE', nameEn: 'United Arab Emirates', nameFr: 'Émirats Arabes Unis', flag: '🇦🇪' },
  { code: 'GA', nameEn: 'Gabon', nameFr: 'Gabon', flag: '🇬🇦' },
  { code: 'GQ', nameEn: 'Equatorial Guinea', nameFr: 'Guinée Équatoriale', flag: '🇬🇶' },
  { code: 'TD', nameEn: 'Chad', nameFr: 'Tchad', flag: '🇹🇩' },
  { code: 'CG', nameEn: 'Republic of the Congo', nameFr: 'Congo-Brazzaville', flag: '🇨🇬' },
  { code: 'CD', nameEn: 'DR Congo', nameFr: 'RD Congo', flag: '🇨🇩' },
  { code: 'CI', nameEn: 'Ivory Coast', nameFr: 'Côte d’Ivoire', flag: '🇨🇮' },
  { code: 'SN', nameEn: 'Senegal', nameFr: 'Sénégal', flag: '🇸🇳' },
  { code: 'NG', nameEn: 'Nigeria', nameFr: 'Nigéria', flag: '🇳🇬' },
  { code: 'ZA', nameEn: 'South Africa', nameFr: 'Afrique du Sud', flag: '🇿🇦' },
  { code: 'CN', nameEn: 'China', nameFr: 'Chine', flag: '🇨🇳' },
  { code: 'NL', nameEn: 'Netherlands', nameFr: 'Pays-Bas', flag: '🇳🇱' },
  { code: 'SE', nameEn: 'Sweden', nameFr: 'Suède', flag: '🇸🇪' },
  { code: 'NO', nameEn: 'Norway', nameFr: 'Norvège', flag: '🇳🇴' },
  { code: 'LU', nameEn: 'Luxembourg', nameFr: 'Luxembourg', flag: '🇱🇺' },
  { code: 'AU', nameEn: 'Australia', nameFr: 'Australie', flag: '🇦🇺' },
  { code: 'BR', nameEn: 'Brazil', nameFr: 'Brésil', flag: '🇧🇷' },
  { code: 'OTHER', nameEn: 'Other Country', nameFr: 'Autre pays', flag: '🌐' },
];

