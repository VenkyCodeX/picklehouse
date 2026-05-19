import { createContext, useContext, useState } from 'react';

const LangContext = createContext();

const translations = {
  en: {
    home: 'Home', products: 'Products', about: 'About', nri: 'NRI Packing',
    gallery: 'Gallery', reviews: 'Reviews', contact: 'Contact',
    shopNow: 'Shop Now', viewNRI: 'View NRI Packing',
    addToCart: 'Add to Cart', outOfStock: 'Out of Stock',
    tagline: 'Taste the Original',
    subTagline: 'Authentic Handcrafted Pickles from Hyderabad',
    teluguTagline: 'శ్రేష్టమైన పచ్చళ్ళు | నువ్వుల నూనె తో తయారు',
    natural: '100% Natural', noPreservatives: 'No Preservatives',
    nriShipping: 'NRI Shipping', fiveStar: '5★ Rated',
    withoutGarlic: 'Without Garlic',
    featuredProducts: 'Our Signature Pickles',
    allProducts: 'All Products',
    searchPlaceholder: 'Search pickles, powders...',
  },
  te: {
    home: 'హోమ్', products: 'ఉత్పత్తులు', about: 'మా గురించి', nri: 'NRI పాకింగ్',
    gallery: 'గ్యాలరీ', reviews: 'సమీక్షలు', contact: 'సంప్రదించండి',
    shopNow: 'ఇప్పుడే కొనండి', viewNRI: 'NRI పాకింగ్ చూడండి',
    addToCart: 'కార్ట్‌కు జోడించండి', outOfStock: 'స్టాక్ లేదు',
    tagline: 'అసలైన రుచి',
    subTagline: 'హైదరాబాద్ నుండి అసలైన చేతితో తయారు చేసిన పచ్చళ్ళు',
    teluguTagline: 'శ్రేష్టమైన పచ్చళ్ళు | నువ్వుల నూనె తో తయారు',
    natural: '100% సహజం', noPreservatives: 'సంరక్షకాలు లేవు',
    nriShipping: 'NRI షిప్పింగ్', fiveStar: '5★ రేటింగ్',
    withoutGarlic: 'వెల్లుల్లి లేకుండా',
    featuredProducts: 'మా ప్రత్యేక పచ్చళ్ళు',
    allProducts: 'అన్ని ఉత్పత్తులు',
    searchPlaceholder: 'పచ్చళ్ళు, పొడులు వెతకండి...',
  },
};

export function LangProvider({ children }) {
  const [lang, setLang] = useState('en');
  const t = translations[lang];
  const toggleLang = () => setLang(l => l === 'en' ? 'te' : 'en');
  return (
    <LangContext.Provider value={{ lang, t, toggleLang }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
