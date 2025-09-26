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
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [currentTopic, setCurrentTopic] = useState<Topic | null>(null);

  const themeClass = preferences?.gender === 'girls' ? 'girls-theme' : 'boys-theme';

  return (
    <AppContext.Provider
      value={{
        preferences,
        setPreferences,
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