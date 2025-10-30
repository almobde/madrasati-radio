// سياق التطبيق - App Context
import { createContext, useContext, useState, ReactNode } from 'react';
import { UserPreferences, Topic } from '../types';

interface AppContextType {
  preferences: UserPreferences | null;
  setPreferences: (preferences: UserPreferences) => void;
  currentTopic: Topic | null;
  setCurrentTopic: (topic: Topic | null) => void;
  themeClass: string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  // Load preferences from localStorage on mount
  const [preferences, setPreferences] = useState<UserPreferences | null>(() => {
    try {
      const saved = localStorage.getItem('userPreferences');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [currentTopic, setCurrentTopic] = useState<Topic | null>(null);

  // Custom setPreferences that also saves to localStorage
  const setPreferencesWithStorage = (prefs: UserPreferences | null) => {
    setPreferences(prefs);
    if (prefs) {
      localStorage.setItem('userPreferences', JSON.stringify(prefs));
    } else {
      localStorage.removeItem('userPreferences');
    }
  };

  const themeClass = preferences?.gender === 'girls' ? 'girls-theme' : 'boys-theme';

  return (
    <AppContext.Provider
      value={{
        preferences,
        setPreferences: setPreferencesWithStorage,
        currentTopic,
        setCurrentTopic,
        themeClass,
      }}
    >
      <div className={`min-h-screen bg-gray-50 ${themeClass}`}>
        {children}
      </div>
    </AppContext.Provider>
  );
};