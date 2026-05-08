import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Globe, AlertCircle, CheckCircle2, Languages, Save, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock translation data for the hub
const getTranslationKeys = (obj: any, prefix = ''): string[] => {
  return Object.keys(obj).reduce((res: string[], el) => {
    if (typeof obj[el] === 'object' && obj[el] !== null) {
      return [...res, ...getTranslationKeys(obj[el], prefix + el + '.')];
    }
    return [...res, prefix + el];
  }, []);
};

const TranslationPage = () => {
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNamespace, setActiveNamespace] = useState('all');

  // Languages to manage
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
    { code: 'mr', name: 'Marathi' },
    { code: 'kn', name: 'Kannada' }
  ];

  // Get all keys from English (source of truth)
  const resources = i18n.options.resources || {};
  const enTranslations = resources.en?.translation || {};
  const allKeys = getTranslationKeys(enTranslations);

  const filteredKeys = allKeys.filter(key => 
    key.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (activeNamespace === 'all' || key.startsWith(activeNamespace))
  );

  const getTranslation = (lng: string, key: string) => {
    const parts = key.split('.');
    let current = resources[lng]?.translation;
    for (const part of parts) {
      if (current === undefined) return null;
      current = current[part];
    }
    return current;
  };

  const getCompletionStats = (lng: string) => {
    const total = allKeys.length;
    const translated = allKeys.filter(key => getTranslation(lng, key) !== null).length;
    return { total, translated, percentage: Math.round((translated / total) * 100) };
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2 flex items-center gap-3">
            <Languages className="text-primary-500" size={36} />
            Translation Hub
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Manage platform localization and synchronize translation keys across all languages.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-dark-800 border border-slate-200 dark:border-white/10 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-dark-700 transition-all">
            <RefreshCw size={18} />
            Sync Keys
          </button>
          <button className="flex items-center gap-2 px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-bold shadow-lg shadow-primary-500/25 transition-all">
            <Save size={18} />
            Publish Changes
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {languages.map(lang => {
          const stats = getCompletionStats(lang.code);
          return (
            <div key={lang.code} className="bg-white dark:bg-dark-800 p-6 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{lang.name}</span>
                <Globe size={20} className="text-primary-500" />
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white">{stats.percentage}%</h3>
                  <p className="text-xs text-slate-500 mt-1">{stats.translated} of {stats.total} keys</p>
                </div>
                <div className="w-20 h-2 bg-slate-100 dark:bg-dark-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary-500 transition-all duration-1000" 
                    style={{ width: `${stats.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-dark-800 p-4 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search translation keys (e.g., landing.hero.title)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-dark-900/50 border border-slate-200 dark:border-white/5 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all text-slate-900 dark:text-white"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
          {['all', 'landing', 'about', 'contact', 'auth', 'dashboard'].map(ns => (
            <button
              key={ns}
              onClick={() => setActiveNamespace(ns)}
              className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all whitespace-nowrap ${
                activeNamespace === ns 
                  ? 'bg-primary-500 text-white shadow-md' 
                  : 'bg-slate-100 dark:bg-dark-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-dark-600'
              }`}
            >
              {ns}
            </button>
          ))}
        </div>
      </div>

      {/* Translation Grid */}
      <div className="space-y-4">
        {filteredKeys.map((key) => (
          <motion.div
            layout
            key={key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-dark-800 rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm hover:shadow-md transition-all"
          >
            <div className="p-4 bg-slate-50 dark:bg-dark-900/30 border-b border-slate-200 dark:border-white/5 flex items-center justify-between">
              <code className="text-xs font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-500/10 px-2 py-1 rounded">{key}</code>
              <div className="flex items-center gap-4">
                {languages.map(lang => {
                  const val = getTranslation(lang.code, key);
                  return (
                    <div key={lang.code} className="flex items-center gap-1">
                      {val ? (
                        <CheckCircle2 size={14} className="text-emerald-500" />
                      ) : (
                        <AlertCircle size={14} className="text-amber-500" />
                      )}
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{lang.code}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-6">
              {languages.map(lang => {
                const value = getTranslation(lang.code, key);
                return (
                  <div key={lang.code} className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      {lang.name}
                      {!value && <span className="text-amber-500 normal-case font-bold flex items-center gap-1"><AlertCircle size={10} /> Missing</span>}
                    </label>
                    <textarea
                      rows={2}
                      defaultValue={value || ''}
                      placeholder={`Enter ${lang.name} translation...`}
                      className={`w-full p-3 text-sm bg-white dark:bg-dark-900 border rounded-xl outline-none focus:ring-2 transition-all ${
                        !value 
                          ? 'border-amber-200 dark:border-amber-500/20 focus:ring-amber-500' 
                          : 'border-slate-200 dark:border-white/5 focus:ring-primary-500'
                      } text-slate-900 dark:text-slate-200`}
                    />
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}

        {filteredKeys.length === 0 && (
          <div className="text-center py-20 bg-slate-50 dark:bg-dark-900/20 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-white/5">
            <Languages size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500 font-bold">No translation keys found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TranslationPage;
