// سياق التطبيق - App Context
import { createContext, useContext, useState, ReactNode } from 'react';
import { UserPreferences, Topic } from '../types';

interface AppContextType {
  preferences: UserPreferences | null;
  setPreferences: (preferences: UserPreferences) => void;
  currentTopic: Topic | null;
  setCurrentTopic: (topic: Topic | null) => void;
  themeClass: string;
  fontSize: number;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  resetFontSize: () => void;
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
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [currentTopic, setCurrentTopic] = useState<Topic | null>(null);
  const [fontSize, setFontSize] = useState<number>(100);

  const themeClass = preferences?.gender === 'girls' ? 'girls-theme' : 'boys-theme';

  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 10, 150));
  };

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 10, 70));
  };

  const resetFontSize = () => {
    setFontSize(100);
  };

  return (
    <AppContext.Provider
      value={{
        preferences,
        setPreferences,
        currentTopic,
        setCurrentTopic,
        themeClass,
        fontSize,
        increaseFontSize,
        decreaseFontSize,
        resetFontSize,
      }}
    >
      <div className={`min-h-screen bg-gray-50 ${themeClass}`} style={{ fontSize: `${fontSize}%` }}>
        {children}
      </div>
    </AppContext.Provider>
  );
};