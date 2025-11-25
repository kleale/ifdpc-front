import { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';

export const useContextSuggestions = (): string[] => {
  const { currentPage, selectedItem, isFormDirty, userData } = useAppContext();
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    const generateSuggestions = (): void => {
      const newSuggestions: string[] = [];

      // Подсказки на основе текущей страницы
      switch (currentPage) {
        case 'home':
          newSuggestions.push(
            'Вы можете создать новый проект или просмотреть существующие',
            'Попробуйте использовать поиск для быстрого доступа',
            'Не забудьте заполнить профиль для персонализированных рекомендаций'
          );
          break;

        case 'projects':
          if (selectedItem) {
            newSuggestions.push(
              `Вы работаете с проектом "${selectedItem}". Вы можете его редактировать или поделиться`,
              'Попробуйте добавить участников в проект для совместной работы',
              'Не забудьте сохранить изменения перед выходом'
            );
          } else {
            newSuggestions.push(
              'Выберите проект для просмотра деталей',
              'Создайте новый проект, нажав кнопку "Добавить"',
              'Используйте фильтры для сортировки проектов'
            );
          }
          break;

        case 'profile':
          newSuggestions.push(
            'Обновите информацию о себе для лучших рекомендаций',
            'Проверьте настройки уведомлений',
            'Добавьте аватар для персонализации аккаунта'
          );
          break;

        case 'settings':
          newSuggestions.push(
            'Настройте параметры безопасности',
            'Проверьте подключенные сервисы',
            'Экспортируйте данные для резервной копии'
          );
          break;

        default:
          newSuggestions.push(
            'Исследуйте доступные разделы приложения',
            'Используйте помощь ассистента при возникновении вопросов'
          );
      }

      // Контекстные подсказки на основе состояния формы
      if (isFormDirty) {
        newSuggestions.push('У вас есть несохраненные изменения. Не забудьте сохранить!');
      }

      // Подсказки на основе данных пользователя
      if (!userData.email) {
        newSuggestions.push('Добавьте email для восстановления доступа к аккаунту');
      }

      if (!userData.phone) {
        newSuggestions.push('Укажите телефон для дополнительной безопасности');
      }

      // Уникализируем подсказки
      setSuggestions(Array.from(new Set(newSuggestions)));
    };

    generateSuggestions();
  }, [currentPage, selectedItem, isFormDirty, userData]);

  return suggestions;
};