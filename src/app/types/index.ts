export interface MessageButton {
  id: string;
  text: string;
  action?: string;
  type?: "primary" | "secondary" | "danger";
}

export interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
  isSuggestion?: boolean;
  isError?: boolean;
  buttons?: MessageButton[];
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

  graphData: any;
  setGraphData: (data: any[]) => void;
}

export type QuickAction = "read" | "alt" | "recommend" | "cancel";

// Типы для ресайзинга
export interface ChatBotPosition {
  x: number;
  y: number;
}

export interface ChatBotSize {
  width: number;
  height: number;
}

export interface ResizeState {
  isResizing: boolean;
  resizeDirection: "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw" | null;
  startX: number;
  startY: number;
  startWidth: number;
  startHeight: number;
  startLeft: number;
  startTop: number;
}
