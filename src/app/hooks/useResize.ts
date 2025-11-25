import { useState, useCallback, useRef, useEffect } from 'react';
import { ResizeState, ChatBotSize, ChatBotPosition } from '../types';

interface UseResizeProps {
  initialWidth: number;
  initialHeight: number;
  minWidth: number;
  minHeight: number;
  maxWidth?: number;
  maxHeight?: number;
}

interface UseResizeReturn {
  size: ChatBotSize;
  position: ChatBotPosition;
  resizeState: ResizeState;
  handleMouseDown: (e: React.MouseEvent, direction: ResizeState['resizeDirection']) => void;
  handleDrag: (e: MouseEvent) => void;
  handleDragEnd: () => void;
  setPosition: (pos: ChatBotPosition) => void;
}

export const useResize = ({
  initialWidth,
  initialHeight,
  minWidth,
  minHeight,
  maxWidth = window.innerWidth - 40,
  maxHeight = window.innerHeight - 40
}: UseResizeProps): UseResizeReturn => {
  const [size, setSize] = useState<ChatBotSize>({
    width: initialWidth,
    height: initialHeight
  });

  const [position, setPosition] = useState<ChatBotPosition>({
    x: window.innerWidth - initialWidth - 24,
    y: window.innerHeight - initialHeight - 24
  });

  const [resizeState, setResizeState] = useState<ResizeState>({
    isResizing: false,
    resizeDirection: null,
    startX: 0,
    startY: 0,
    startWidth: 0,
    startHeight: 0,
    startLeft: 0,
    startTop: 0
  });

  const isDragging = useRef<boolean>(false);

  const handleMouseDown = useCallback((e: React.MouseEvent, direction: ResizeState['resizeDirection']): void => {
    e.preventDefault();
    e.stopPropagation();

    setResizeState({
      isResizing: true,
      resizeDirection: direction,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: size.width,
      startHeight: size.height,
      startLeft: position.x,
      startTop: position.y
    });

    isDragging.current = true;
  }, [size, position]);

  const handleDrag = useCallback((e: MouseEvent): void => {
    if (!isDragging.current || !resizeState.isResizing || !resizeState.resizeDirection) return;

    const deltaX = e.clientX - resizeState.startX;
    const deltaY = e.clientY - resizeState.startY;

    let newWidth = resizeState.startWidth;
    let newHeight = resizeState.startHeight;
    let newX = resizeState.startLeft;
    let newY = resizeState.startTop;

    const direction = resizeState.resizeDirection;

    if (direction.includes('e')) {
      newWidth = Math.max(minWidth, Math.min(maxWidth, resizeState.startWidth + deltaX));
    }
    
    if (direction.includes('w')) {
      const widthChange = resizeState.startWidth - deltaX;
      if (widthChange >= minWidth && widthChange <= maxWidth) {
        newWidth = widthChange;
        newX = resizeState.startLeft + deltaX;
      }
    }

    if (direction.includes('s')) {
      newHeight = Math.max(minHeight, Math.min(maxHeight, resizeState.startHeight + deltaY));
    }
    
    if (direction.includes('n')) {
      const heightChange = resizeState.startHeight - deltaY;
      if (heightChange >= minHeight && heightChange <= maxHeight) {
        newHeight = heightChange;
        newY = resizeState.startTop + deltaY;
      }
    }

    setSize({
      width: newWidth,
      height: newHeight
    });

    setPosition({
      x: newX,
      y: newY
    });
  }, [resizeState, minWidth, minHeight, maxWidth, maxHeight]);

  const handleDragEnd = useCallback((): void => {
    isDragging.current = false;
    setResizeState(prev => ({ ...prev, isResizing: false, resizeDirection: null }));
  }, []);

  useEffect(() => {
    if (resizeState.isResizing) {
      document.addEventListener('mousemove', handleDrag);
      document.addEventListener('mouseup', handleDragEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleDrag);
        document.removeEventListener('mouseup', handleDragEnd);
      };
    }
  }, [resizeState.isResizing, handleDrag, handleDragEnd]);

  return {
    size,
    position,
    resizeState,
    handleMouseDown,
    handleDrag,
    handleDragEnd,
    setPosition
  };
};