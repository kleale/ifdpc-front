import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AppContextType, UserData } from '../types';

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData>({});
  const [isFormDirty, setIsFormDirty] = useState<boolean>(false);

  const value: AppContextType = {
    currentPage,
    setCurrentPage,
    selectedItem,
    setSelectedItem,
    userData,
    setUserData,
    isFormDirty,
    setIsFormDirty
  };

  return (
    <AppContext.Provider value={value}>{children}</AppContext.Provider>
  );
};