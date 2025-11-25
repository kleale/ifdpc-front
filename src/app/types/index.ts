export interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
  isSuggestion?: boolean;
}

export interface UserData {
  name?: string;
  email?: string;
  phone?: string;
  lastSave?: string;
}

export interface AppContextType {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  selectedItem: string | null;
  setSelectedItem: (item: string | null) => void;
  userData: UserData;
  setUserData: (data: UserData | ((prev: UserData) => UserData)) => void;
  isFormDirty: boolean;
  setIsFormDirty: (dirty: boolean) => void;
}

export type QuickAction = 'Помощь' | 'Что делать?' | 'Сохранить' | 'Отмена';