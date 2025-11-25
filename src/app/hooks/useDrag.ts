import { useState, useRef, useCallback, useEffect } from 'react';
import { ChatBotPosition } from '../types';

interface UseDragReturn {
  position: ChatBotPosition;
  isDragging: boolean;
  handleDragStart: (e: React.MouseEvent) => void;
}

export const useDrag = (initialPosition: ChatBotPosition): UseDragReturn => {
  const [position, setPosition] = useState<ChatBotPosition>(initialPosition);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleDragStart = useCallback((e: React.MouseEvent): void => {
    e.preventDefault();
    
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    
    setIsDragging(true);
  }, []);

  const handleDrag = useCallback((e: MouseEvent): void => {
    if (!isDragging) return;

    const newX = e.clientX - dragOffset.current.x;
    const newY = e.clientY - dragOffset.current.y;

    const maxX = window.innerWidth - 100;
    const maxY = window.innerHeight - 100;

    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY))
    });
  }, [isDragging]);

  const handleDragEnd = useCallback((): void => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleDrag);
      document.addEventListener('mouseup', handleDragEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleDrag);
        document.removeEventListener('mouseup', handleDragEnd);
      };
    }
  }, [isDragging, handleDrag, handleDragEnd]);

  return {
    position,
    isDragging,
    handleDragStart
  };
};