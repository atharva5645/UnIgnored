import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const languages = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' }
];

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = React.useState(false);

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-[32px] bg-slate-50 dark:bg-white/5 hover:bg-black hover:text-white dark:hover:bg-[#00d1ff] dark:hover:text-black transition-all duration-300 border border-slate-200 dark:border-white/10 group"
      >
        <Globe size={18} className="text-black dark:text-[#00d1ff] group-hover:text-inherit" />
        <span className="text-xs font-black uppercase tracking-widest">
          {currentLanguage.native}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              className="absolute right-0 mt-3 w-56 bg-white dark:bg-[#0f172a] border-2 border-black dark:border-white/10 rounded-[32px] shadow-2xl z-50 overflow-hidden p-2"
            >
              <div className="space-y-1">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-[24px] text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all duration-300"
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-black text-xs uppercase tracking-tight">{lang.native}</span>
                      <span className="text-[10px] opacity-50 uppercase tracking-tighter">{lang.name}</span>
                    </div>
                    {i18n.language === lang.code && (
                      <div className="w-6 h-6 rounded-full bg-black dark:bg-[#00d1ff] flex items-center justify-center">
                        <Check size={14} className="text-white dark:text-black" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
