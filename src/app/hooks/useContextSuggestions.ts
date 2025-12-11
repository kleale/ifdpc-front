import { useState, useEffect } from "react";
import { useAppContext } from "../contexts/AppContext";
import { useAI } from "./useAI";

export const useContextSuggestions = (
  contextApp: any
): { suggestions: string[]; isLoading: boolean } => {
  const { currentPage, selectedItem, isFormDirty, userData } = useAppContext();
  const { generateSuggestion, isGenerating } = useAI();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [aiSuggestion, setAiSuggestion] = useState<string>("");

  useEffect(() => {

    const generateContextDescription = (): string => {
      let context =
        "Запомни эти данные и контектст JSON и отвечай всегда опираясь на них: " +
        JSON.stringify(contextApp); // || `Пользователь находится на странице: ${currentPage}. `;

      // switch (currentPage) {
      //   case 'home':
      //     context += 'Это главная страница приложения. ';
      //     break;
      //   case 'projects':
      //     context += selectedItem
      //       ? `Работает с проектом: "${selectedItem}". `
      //       : 'Просматривает список проектов. ';
      //     break;
      //   case 'profile':
      //     context += 'Находится в профиле пользователя. ';
      //     break;
      //   case 'settings':
      //     context += 'В разделе настроек приложения. ';
      //     break;
      // }

      // if (isFormDirty) {
      //   context += 'Есть несохраненные изменения. ';
      // }

      // if (!userData.email) {
      //   context += 'Email пользователя не заполнен. ';
      // }

      // if (!userData.phone) {
      //   context += 'Телефон пользователя не заполнен. ';
      // }

      return context;
    };

    const getAISuggestion = async (): Promise<void> => {
      try {
        const context = generateContextDescription();
        const suggestion = await generateSuggestion(context);
        setAiSuggestion(suggestion);
      } catch (error) {
        console.error("Failed to generate AI suggestion:", error);
        setAiSuggestion("");
      }
    };

    // Генерируем базовые подсказки
    const baseSuggestions: string[] = [];

    // switch (currentPage) {
    //   case "home":
    //     baseSuggestions.push(
    //       "Создайте новый проект или просмотрите существующие",
    //       "Используйте поиск для быстрого доступа к функциям"
    //     );
    //     break;
    //   case "projects":
    //     if (selectedItem) {
    //       baseSuggestions.push(
    //         `Редактируйте проект "${selectedItem}"`,
    //         "Добавьте участников для совместной работы"
    //       );
    //     } else {
    //       baseSuggestions.push(
    //         "Выберите проект для детального просмотра",
    //         "Создайте новый проект"
    //       );
    //     }
    //     break;
    //   case "profile":
    //     baseSuggestions.push(
    //       "Обновите личную информацию",
    //       "Проверьте настройки уведомлений"
    //     );
    //     break;
    //   case "settings":
    //     baseSuggestions.push(
    //       "Настройте параметры безопасности",
    //       "Проверьте подключенные интеграции"
    //     );
    //     break;
    // }

    if (isFormDirty) {
      baseSuggestions.push("Сохраните несохраненные изменения");
    }

    // Добавляем AI-подсказку если она есть
    const allSuggestions = aiSuggestion
      ? [aiSuggestion, ...baseSuggestions]
      : baseSuggestions;

    setSuggestions(Array.from(new Set(allSuggestions)));

    // Запрашиваем AI-подсказку при изменении контекста
    getAISuggestion();
  }, [currentPage, selectedItem, isFormDirty, userData, generateSuggestion]);

  return { suggestions, isLoading: isGenerating };
};
