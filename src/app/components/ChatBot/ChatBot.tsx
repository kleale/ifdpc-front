import React, { useState, useRef, useEffect, FormEvent } from "react";
import { useContextSuggestions } from "../../hooks/useContextSuggestions";
import { useAI } from "../../hooks/useAI";
import { useResize } from "../../hooks/useResize";
import { useDrag } from "../../hooks/useDrag";
import { ChatMessage } from "./ChatMessage";
import { Message, QuickAction, MessageButton } from "../../types";
import "./ChatBot.css";
import { AIMessage } from "app/types/aiServiceTypes";
import { Switch } from "@consta/uikit/Switch";
import { IconMeatball } from "@consta/icons/IconMeatball";
import { Button } from "@consta/uikit/Button";
import { ContextMenu } from "@consta/uikit/ContextMenu";
import { IconShare } from "../../components/Icons/IconShare";

import { IconHamburger } from "@consta/icons/IconHamburger";
import { IconAdd } from "@consta/icons/IconAdd";
import { FileField } from "@consta/uikit/FileField";
import { File } from "@consta/uikit/File";
import { IconRename } from "../Icons/IconRename";
import { IconAddProject } from "../Icons/IconAddProject";
import { IconArchive } from "../Icons/IconArchive";
import { IconDelete } from "../Icons/IconDelete";
import { IconClose } from "@consta/icons/IconClose";

import { Sidebar } from "@consta/uikit/Sidebar";
import { useFlag } from "@consta/uikit/useFlag";
import { List } from "@consta/uikit/ListCanary";
import { IconPaperClip } from "../Icons/IconPaperClip";
import { useAppContext } from "app/contexts/AppContext";

import { Modal } from "@consta/uikit/Modal";
import { Layout } from "@consta/uikit/Layout";
import { Tabs } from "@consta/uikit/Tabs";
import MainAppNode from "../MainApp/MainAppNode";
import { v4 as uuidv4 } from 'uuid';

// DEMO JSONS
import jsonPagerankInput from "./../../../viz0/pagerank/input.json";
import jsonPagerank1 from "./../../../viz0/pagerank/pg_1_step.json";
import jsonPagerank2 from "./../../../viz0/pagerank/pg_2_step.json";
import jsonPagerank3 from "./../../../viz0/pagerank/pg_3_step.json";
import jsonPagerank4 from "./../../../viz0/pagerank/pg_4_step.json";
import jsonPagerank5 from "./../../../viz0/pagerank/pg_5_step.json";

import jsonAltInput from "./../../../viz0/alternatives/input.json";
import jsonAlt1 from "./../../../viz0/alternatives/Scenario 1.json";
import jsonAlt2 from "./../../../viz0/alternatives/Scenario 2.json";
// import jsonAlt3 from "./../../../viz0/alternatives/Scenario 3.json";
// import jsonAlt4 from "./../../../viz0/alternatives/Scenario 4.json";
// import jsonAlt5 from "./../../../viz0/alternatives/Scenario 5.json";


export const ChatBot: React.FC = () => {
  const { graphData, setGraphData, graphDataAlt, setGraphDataAlt, setIsModal } =
    useAppContext();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Здравствуйте! Я ваш AI-помощник. Готов помочь с работой в приложении!",
      isBot: true,
      timestamp: new Date(),
      buttons: [
        { id: "welcome-help", text: "Получить помощь", type: "primary" },
        { id: "welcome-features", text: "Возможности", type: "secondary" },
        { id: "welcome-tutorial", text: "Как пользоваться", type: "secondary" },
      ],
    },
  ]);
  const [inputValue, setInputValue] = useState<string>("");
  const { suggestions, isLoading: suggestionsLoading } =
    useContextSuggestions(graphData);
  const { generateResponse, isGenerating, error } = useAI();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    size,
    position,
    resizeState,
    handleMouseDown: handleResizeStart,
    setPosition,
  } = useResize({
    initialWidth: 400,
    initialHeight: 560,
    minWidth: 320,
    minHeight: 420,
    maxWidth: window.innerWidth - 40,
    maxHeight: window.innerHeight - 40,
  });

  const {
    position: dragPosition,
    isDragging,
    handleDragStart,
  } = useDrag(position);

  // Modal
  const tabs: string[] = [
    "Сценарий 1",
    "Сценарий 2"
    // "Сценарий 3",
    // "Сценарий 4",
  ];
  const getItemLabel = (label: string) => label;
  const [tab, setTab] = useState<string | null>(tabs[0]);

  useEffect(() => {
    setPosition(dragPosition);
  }, [dragPosition, setPosition]);

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Обработчик клика по кнопкам в сообщениях
  const handleMessageButtonClick = (button: {
    id: string;
    text: string;
    action?: string;
  }) => {
    // Добавляем сообщение пользователя с текстом кнопки
    const userMessage: Message = {
      id: uuidv4(),
      text: button.text,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Обрабатываем разные типы кнопок
    switch (button.id) {
      case "welcome-help":
        handleQuickAction("read");
        break;
      case "welcome-features":
        showFeatures();
        break;
      case "welcome-tutorial":
        showTutorial();
        break;
      case "create-project":
        handleCreateProject();
        break;

      case "alt-1":
        doAltAlgoritm_1();
        break;

      case "alt-view-modal":
        showAltModal();
        break;

      case "recommendInput":
        loadRecommendInput();
        break;

      case "loadRecommendOutput":
        loadRecommendOutput();
        break;

      case "recommendLoadResult_1":
        recommendLoadResult_var(jsonPagerank1);
        break;

      case "recommendLoadResult_2":
        recommendLoadResult_var(jsonPagerank2);
        break;

      case "recommendLoadResult_3":
        recommendLoadResult_var(jsonPagerank3);
        break;

      case "recommendLoadResult_3":
        recommendLoadResult_var(jsonPagerank4);
        break;

      case "recommendLoadResult_3":
        recommendLoadResult_var(jsonPagerank5);
        break;

      // case "view-projects":
      //   handleViewProjects();
      //   break;
      // case "profile-settings":
      //   handleProfileSettings();
      //   break;
      default:
        // Для остальных кнопок генерируем ответ через AI
        generateButtonResponse(button);
    }
  };

  const showFeatures = () => {
    const featuresMessage: Message = {
      id: uuidv4() + 1,
      text: "Вот основные возможности:\n\n• Помощь в анализе и настройке проекта\n• Рекомендации новых узлов графа и их параметров \n• Расчет альтернативных графов \n\n Что вас интересует?",
      isBot: true,
      timestamp: new Date(),
      buttons: [
        { id: "read", text: "Проанализируй текущий граф", type: "primary" },
        { id: "recommend", text: "Рекомендация новых узлов", type: "primary" },
        {
          id: "alt",
          text: "Рассчитай aльтернативные варианты",
          type: "primary",
        },
        // { id: "create-project", text: "Создать проект", type: "primary" },
        // { id: "view-projects", text: "Мои проекты", type: "secondary" },
        // { id: "profile-settings", text: "Настройки", type: "secondary" },
      ],
    };

    setTimeout(() => {
      setMessages((prev) => [...prev, featuresMessage]);
    }, 500);
  };

  const showTutorial = () => {
    const tutorialMessage: Message = {
      id: uuidv4() + 1,
      text: "Чтобы начать работу:\n\n1. Создайте проект или выберите существующий\n2. Настройте параметры проекта\n3. Начните добавлять узлы и их параметры\n\nДалее можете запустить алгоритм расчета?",
      isBot: true,
      timestamp: new Date(),
      buttons: [
        { id: "read", text: "Проанализируй текущий граф", type: "primary" },
        { id: "recommend", text: "Рекомендация новых узлов", type: "primary" },
        {
          id: "alt",
          text: "Рассчитай aльтернативные варианты",
          type: "primary",
        },
        // { id: "tutorial-step1", text: "Создание проекта", type: "secondary" },
        // { id: "tutorial-step2", text: "Добавление команды", type: "secondary" },
        // { id: "tutorial-step3", text: "Настройки", type: "secondary" },
      ],
    };

    setTimeout(() => {
      setMessages((prev) => [...prev, tutorialMessage]);
    }, 500);
  };

  const handleCreateProject = () => {
    const responseMessage: Message = {
      id: uuidv4() + 1,
      text: 'Отлично! Чтобы создать проект:\n\n1. Нажмите кнопку "Создать проект" в верхней панели\n2. Заполните название и описание\n3. Выберите настройки видимости\n4. Добавьте участников (опционально)\n5. Нажмите "Создать"\n\nХотите, чтобы я помог с заполнением?',
      isBot: true,
      timestamp: new Date(),
      // buttons: [
      //   { id: "help-fill-form", text: "Помощь с заполнением", type: "primary" },
      //   { id: "cancel-create", text: "Отмена", type: "secondary" },
      // ],
    };

    setTimeout(() => {
      setMessages((prev) => [...prev, responseMessage]);
    }, 500);
  };

  // const handleViewProjects = () => {
  //   const responseMessage: Message = {
  //     id: uuidv4() + 1,
  //     text: "Переход к списку проектов... У вас 3 активных проекта:\n\n• Веб-сайт компании (в работе)\n• Мобильное приложение (завершен)\n• Дизайн система (планирование)\n\nКакой проект вас интересует?",
  //     isBot: true,
  //     timestamp: new Date(),
  //     buttons: [
  //       { id: "project-1", text: "Веб-сайт", type: "secondary" },
  //       { id: "project-2", text: "Мобильное приложение", type: "secondary" },
  //       { id: "project-3", text: "Дизайн система", type: "secondary" },
  //     ],
  //   };

  //   setTimeout(() => {
  //     setMessages((prev) => [...prev, responseMessage]);
  //   }, 500);
  // };

  // const handleProfileSettings = () => {
  //   const responseMessage: Message = {
  //     id: uuidv4() + 1,
  //     text: "Настройки профиля:\n\n• Личная информация\n• Уведомления\n• Безопасность\n• Интеграции\n\nКакой раздел настроек вас интересует?",
  //     isBot: true,
  //     timestamp: new Date(),
  //     buttons: [
  //       {
  //         id: "settings-profile",
  //         text: "Личная информация",
  //         type: "secondary",
  //       },
  //       {
  //         id: "settings-notifications",
  //         text: "Уведомления",
  //         type: "secondary",
  //       },
  //       { id: "settings-security", text: "Безопасность", type: "secondary" },
  //     ],
  //   };

  //   setTimeout(() => {
  //     setMessages((prev) => [...prev, responseMessage]);
  //   }, 500);
  // };

  const generateButtonResponse = async (button: {
    id: string;
    text: string;
    action?: string;
  }) => {
    const loadingMessage: Message = {
      id: uuidv4() + 1,
      text: "Думаю...",
      isBot: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, loadingMessage]);

    try {
      const AIMessages: AIMessage[] = [
        {
          role: "user",
          content: `Пользователь нажал кнопку: "${button.text}". Ответь кратко и полезно.`,
        },
      ];

      const aiResponse = await generateResponse(AIMessages);

      const responseMessage: Message = {
        id: uuidv4() + 2,
        text: aiResponse,
        isBot: true,
        timestamp: new Date(),
        buttons: [
          {
            id: "more-help",
            text: "Нужна дополнительная помощь",
            type: "secondary",
          },
          { id: "other-question", text: "Другой вопрос", type: "secondary" },
        ],
      };

      setMessages((prev) =>
        prev
          .filter((msg) => msg.id !== loadingMessage.id)
          .concat(responseMessage)
      );
    } catch (err) {
      setMessages((prev) =>
        prev
          .filter((msg) => msg.id !== loadingMessage.id)
          .concat({
            id: uuidv4() + 2,
            text: "Извините, не удалось обработать запрос. Попробуйте еще раз.",
            isBot: true,
            isError: true,
            timestamp: new Date(),
          })
      );
    }
  };

  // Автоматически добавляем контекстные подсказки с кнопками
  useEffect(() => {
    if (isOpen && suggestions.length > 0 && !suggestionsLoading) {
      const lastMessage = messages[messages.length - 1];

      if (
        !lastMessage.isSuggestion &&
        !lastMessage.isBot &&
        !lastMessage.buttons
      ) {
        const suggestionMessage: Message = {
          id: uuidv4(),
          text: `💡 ${suggestions[0]}`,
          isBot: true,
          isSuggestion: true,
          timestamp: new Date(),
          buttons: [
            { id: "suggestion-action", text: "Выполнить", type: "primary" },
            {
              id: "suggestion-more",
              text: "Что еще можно сделать?",
              type: "secondary",
            },
          ],
        };
        setMessages((prev) => [...prev, suggestionMessage]);
      }
    }
  }, [suggestions, isOpen, messages, suggestionsLoading]);

  useEffect(() => {
    if (isOpen && suggestions.length > 0 && !suggestionsLoading) {
      //debugger
      const lastMessage = messages[messages.length - 1];

      if (!lastMessage.isSuggestion && !lastMessage.isBot) {
        const suggestionMessage: Message = {
          id: uuidv4(),
          text: `💡 ${suggestions[0]}`,
          isBot: true,
          isSuggestion: true,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, suggestionMessage]);
      }
    }
  }, [suggestions, isOpen, messages, suggestionsLoading]);

  useEffect(() => {
    if (error) {
      const errorMessage: Message = {
        id: uuidv4(),
        text: "Извините, произошла ошибка при подключении к AI. Пожалуйста, попробуйте позже.",
        isBot: true,
        isError: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  }, [error]);

  useEffect(() => {
    switch (tab) {
      case "Сценарий 1":
        setGraphDataAlt(jsonAlt1);
        break;
      case "Сценарий 2":
        setGraphDataAlt(jsonAlt2);
        break;
      // case "Сценарий 3":
      //   setGraphDataAlt(jsonAlt3);
      //   break;
      // case "Сценарий 4":
      //   setGraphDataAlt(jsonAlt4);
      //   break;
      // case "Сценарий 5":
      //   setGraphDataAlt(jsonAlt5);
      //   break;

      default:
        setGraphDataAlt(jsonAltInput);
    }
  }, [tabs]);

  useEffect(() => {
    setIsModal(isModalOpen);
  }, [isModalOpen]);

  const handleSendMessage = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    if (!inputValue.trim() || isGenerating) return;

    const userMessage: Message = {
      id: uuidv4(),
      text: inputValue,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    const loadingMessage: Message = {
      id: uuidv4() + 1,
      text: "Думаю...",
      isBot: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, loadingMessage]);

    try {
      const AIMessages: AIMessage[] = messages
        .filter((msg) => !msg.isSuggestion && !msg.isError)
        .map((msg) => ({
          role: msg.isBot ? "assistant" : "user",
          content: msg.text,
        }));

      AIMessages.push({
        role: "user",
        content: inputValue,
      });

      const aiResponse = await generateResponse(AIMessages);

      setMessages((prev) =>
        prev
          .filter((msg) => msg.id !== loadingMessage.id)
          .concat({
            id: uuidv4() + 2,
            text: aiResponse,
            isBot: true,
            timestamp: new Date(),
          })
      );
    } catch (err) {
      setMessages((prev) =>
        prev
          .filter((msg) => msg.id !== loadingMessage.id)
          .concat({
            id: uuidv4() + 2,
            text: "Извините, не удалось получить ответ. Пожалуйста, попробуйте еще раз.",
            isBot: true,
            isError: true,
            timestamp: new Date(),
          })
      );
    }
  };

  // КНОПКИ

  const doAltAlgoritm = () => {
    setGraphData(jsonAltInput);

    const responseMessage: Message = {
      id: uuidv4() + 1,
      text: "Для запуска рачсета альтернатив выберите стартовый узел, выделив его на проекте и нажите кнопку Далее",
      isBot: true,
      timestamp: new Date(),
      buttons: [
        { id: "alt-1", text: "Далее", type: "primary" },
        { id: "cancel", text: "Отмена", type: "secondary" },
      ],
    };

    setTimeout(() => {
      setMessages((prev) => [...prev, responseMessage]);
    }, 500);
  };

  const doAltAlgoritm_1 = () => {
    const loadingMessage: Message = {
      id: uuidv4() + 1,
      text: "Думаю...",
      isBot: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, loadingMessage]);

    const responseMessage: Message = {
      id: uuidv4() + 1,
      text: "Рассчитано 5 альтернативных сценариев",
      isBot: true,
      timestamp: new Date(),
      buttons: [
        { id: "alt-view-modal", text: "Просмотр сценариев", type: "secondary" },
      ],
    };

    setTimeout(() => {
      setMessages((prev) => [...prev, responseMessage]);
    }, 3500);
  };

  const showAltModal = () => {
    setIsModalOpen(true);

    const responseMessage: Message = {
      id: uuidv4() + 1,
      text: "Открыто окно просмотра сценариев",
      isBot: true,
      timestamp: new Date(),
    };

    setTimeout(() => {
      setMessages((prev) => [...prev, responseMessage]);
    }, 500);
  };

  const doRecommendAlgoritm = () => {
    const responseMessage: Message = {
      id: uuidv4() + 1,
      text: "Загрузить тестовый пример:",
      isBot: true,
      timestamp: new Date(),
      buttons: [
        {
          id: "recommendInput",
          text: "Пример рекомендаций узлов графа",
          type: "primary",
        },
      ],
    };

    setTimeout(() => {
      setMessages((prev) => [...prev, responseMessage]);
    }, 500);
  };

  const loadRecommendInput = () => {
    setGraphData(jsonPagerankInput);

    const responseMessage: Message = {
      id: uuidv4() + 1,
      text: "Начать рассчет рекомендованных узлов?",
      isBot: true,
      timestamp: new Date(),
      buttons: [
        { id: "loadRecommendOutput", text: "Да", type: "primary" },
        {
          id: "recommendInput",
          text: "Отмена, вернуться к исходному",
          type: "primary",
        },
      ],
    };

    setTimeout(() => {
      setMessages((prev) => [...prev, responseMessage]);
    }, 500);
  };

  const loadRecommendOutput = () => {
    const loadingMessage: Message = {
      id: uuidv4() + 1,
      text: "Думаю...",
      isBot: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, loadingMessage]);

    const responseMessage: Message = {
      id: uuidv4() + 1,
      text: "Получено несколько шагов построения графа. Какой вывести?",
      isBot: true,
      timestamp: new Date(),
      buttons: [
        { id: "recommendLoadResult_1", text: "Шаг 1", type: "primary" },
        { id: "recommendLoadResult_2", text: "Шаг 2", type: "primary" },
        { id: "recommendLoadResult_3", text: "Шаг 3", type: "primary" },
        { id: "recommendLoadResult_4", text: "Шаг 4", type: "primary" },
        { id: "recommendLoadResult_5", text: "Шаг 5", type: "primary" },
      ],
    };

    setTimeout(() => {
      setMessages((prev) => [...prev, responseMessage]);
    }, 2500);
  };

  const recommendLoadResult_var = (json: any) => {
    setGraphData(json);

    const responseMessage: Message = {
      id: uuidv4() + 1,
      text: "Рассчет выведен",
      isBot: true,
      timestamp: new Date(),
      buttons: [
        { id: "recommendLoadResult_2", text: "Шаг 2", type: "primary" },
        { id: "recommendLoadResult_3", text: "Шаг 3", type: "primary" },
        { id: "recommendLoadResult_4", text: "Шаг 4", type: "primary" },
        { id: "recommendLoadResult_5", text: "Шаг 5", type: "primary" },
        { id: "recommendInput", text: "К началу", type: "primary" },
      ],
    };

    setTimeout(() => {
      setMessages((prev) => [...prev, responseMessage]);
    }, 500);
  };



  const handleQuickAction = async (actionKey: QuickAction): Promise<void> => {
    const action = QUICK_ACTIONS.find((a) => a.key === actionKey);
    if (!action) return;

    if (action.key == "alt") return doAltAlgoritm();
    if (action.key == "recommend") return doRecommendAlgoritm();

    const actionMessage: Message = {
      id: uuidv4(),
      //@ts-ignore
      text: action.label,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, actionMessage]);

    const loadingMessage: Message = {
      id: uuidv4() + 1,
      text: "Думаю...",
      isBot: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, loadingMessage]);

    try {
      let prompt = "";
      switch (actionKey) {
        case "read":
          prompt =
            "Проанализируй входные данные и запомни для твоих ответов" +
            JSON.stringify(graphData);
          break;
        case "alt":
          prompt = "Запусти расчет альтернативных сценариев.";
          break;
        case "recommend":
          prompt = "Рекомендуй новые узлы";
          break;
      }

      const AIMessages: AIMessage[] = [
        {
          role: "user",
          content: prompt,
        },
      ];

      const aiResponse = await generateResponse(AIMessages);

      setMessages((prev) =>
        prev
          .filter((msg) => msg.id !== loadingMessage.id)
          .concat({
            id: uuidv4() + 2,
            text: aiResponse,
            isBot: true,
            timestamp: new Date(),
          })
      );
    } catch (err) {
      setMessages((prev) =>
        prev
          .filter((msg) => msg.id !== loadingMessage.id)
          .concat({
            id: uuidv4() + 2,
            text: "Не удалось обработать запрос. Попробуйте еще раз.",
            isBot: true,
            isError: true,
            timestamp: new Date(),
          })
      );
    }
  };

  const submitAltScenario = () => {
    setGraphData(graphDataAlt);

    const responseMessage: Message = {
      id: uuidv4() + 1,
      text: "Альтернативный сценарий добавлен в проект",
      isBot: true,
      timestamp: new Date(),
    };

    setTimeout(() => {
      setMessages((prev) => [...prev, responseMessage]);
    }, 500);
  }

  const items = [
    { label: "Поделиться", icon: IconShare },
    { label: "Переименовать", icon: IconRename },
    { label: "Добавить в проект", icon: IconAddProject },
    { label: "Архивировать", icon: IconArchive },
    { label: "Удалить", icon: IconDelete, status: "alert" },
  ];
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const refMenu = useRef<any>(null);

  const [openSidebar, setOpenSidebar] = useFlag();
  const [openSidebarFiles, setOpenSidebarFiles] = useFlag();

  const refAssistantWindow = useRef<any>(null);

  return (
    <>
      {!isOpen && (
        <button
          className="chat-bot-floating-btn"
          onClick={() => setIsOpen(true)}
          title="Открыть AI-помощника"
          type="button"
        >
          <Switch
            size="s"
            checked={isOpen}
            view="ghost"
            onClick={() => setIsOpen(false)}
            aria-label="Закрыть чат"
          />
          Ассистент
          <span className="notification-dot"></span>
        </button>
      )}

      {isOpen && (
        <div
          className="chat-bot-container"
          style={{
            width: `${size.width}px`,
            height: `${size.height}px`,
            left: `${position.x}px`,
            top: `${position.y}px`,
          }}
          ref={refAssistantWindow}
        >
          <div
            className="chat-bot-header drag-handle"
            onMouseDown={handleDragStart}
          >
            <div className="bot-info">
              <span className="bot-avatar">
                <Switch
                  size="s"
                  checked={isOpen}
                  view="ghost"
                  onClick={() => setIsOpen(false)}
                  aria-label="Закрыть чат"
                />
              </span>
              <Button
                iconLeft={IconHamburger}
                onlyIcon
                view="clear"
                onClick={setOpenSidebar.toggle}
                className="chat-bot-menu-btn"
              />

              <div>
                <h3>Ассистент. Подсказки</h3>

                {/* <span className="status">
                  {isGenerating ? 'Печатает...' : 'В сети'}
                  {resizeState.isResizing && ' • Изменение размера'}
                  {isDragging && ' • Перемещение'}
                </span> */}
              </div>
            </div>
            <Button
              iconLeft={IconMeatball}
              onlyIcon
              view="ghost"
              className="close-btn"
              ref={refMenu}
              onClick={() => setIsOpenMenu(!isOpenMenu)}
            />
            <ContextMenu
              isOpen={isOpenMenu}
              items={items}
              getItemRightIcon={(item) => item.icon}
              direction="downStartLeft"
              anchorRef={refMenu}
              onClickOutside={() => setIsOpenMenu(false)}
            />
          </div>

          <div className="chat-messages">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message.text}
                isBot={message.isBot}
                timestamp={message.timestamp}
                isSuggestion={message.isSuggestion}
                isError={message.isError}
                buttons={message.buttons}
                onButtonClick={handleMessageButtonClick}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="quick-actions">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.key}
                onClick={() => handleQuickAction(action.key)}
                type="button"
                disabled={isGenerating}
              >
                {action.label}
              </button>
            ))}
          </div>

          <Sidebar
            isOpen={openSidebarFiles}
            onClickOutside={setOpenSidebarFiles.off}
            onEsc={setOpenSidebarFiles.off}
            style={{ zIndex: 11 }}
            container={refAssistantWindow}
            position="bottom"
            size="none"
            className="chatSidebarFiles"
          >
            <div className="added-files-header">
              <h3>Добавление файлов</h3>
              <Button
                onlyIcon
                iconLeft={IconClose}
                size="s"
                view="clear"
                onClick={setOpenSidebarFiles.off}
              />
            </div>
            <div className="added-files">
              <div className="added-files-list">
                {FILES.map((file) => (
                  <div className="added-file">
                    <File size="s" extension={file.extension} />.
                    {file.extension}
                  </div>
                ))}
              </div>

              <FileField id="FileFieldWithText" className="FileFieldWithText">
                <IconPaperClip /> Добавить файл
              </FileField>
            </div>
          </Sidebar>

          <form onSubmit={handleSendMessage} className="chat-input-form">
            <Button
              className="add-btn"
              onlyIcon
              iconLeft={IconAdd}
              iconSize="s"
              view="secondary"
              onClick={setOpenSidebarFiles.toggle}
            />
            <input
              type="text"
              value={inputValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setInputValue(e.target.value)
              }
              placeholder={
                isGenerating
                  ? "Ассистент генерирует ответ..."
                  : "Введите запрос..."
              }
              className="chat-input"
              disabled={isGenerating}
            />
            <Button
              type="submit"
              onlyIcon
              view="ghost"
              disabled={!inputValue.trim() || isGenerating}
              label={isGenerating ? "⏳" : "→"}
            />
          </form>

          <Sidebar
            isOpen={openSidebar}
            onEsc={setOpenSidebar.off}
            style={{ zIndex: 11 }}
            hasOverlay={false}
            container={refAssistantWindow}
            position="left"
            size="none"
            className="chatSidebar"
          >
            <List
              items={itemsSidebar}
              onItemClick={(item) => alert(`${item.label}`)}
              getItemLeftIcon={(item) => item.icon}
            />
          </Sidebar>

          <div
            className="resize-handle resize-n"
            onMouseDown={(e) => handleResizeStart(e, "n")}
          />
          <div
            className="resize-handle resize-s"
            onMouseDown={(e) => handleResizeStart(e, "s")}
          />
          <div
            className="resize-handle resize-e"
            onMouseDown={(e) => handleResizeStart(e, "e")}
          />
          <div
            className="resize-handle resize-w"
            onMouseDown={(e) => handleResizeStart(e, "w")}
          />
          <div
            className="resize-handle resize-ne"
            onMouseDown={(e) => handleResizeStart(e, "ne")}
          />
          <div
            className="resize-handle resize-nw"
            onMouseDown={(e) => handleResizeStart(e, "nw")}
          />
          <div
            className="resize-handle resize-se"
            onMouseDown={(e) => handleResizeStart(e, "se")}
          />
          <div
            className="resize-handle resize-sw"
            onMouseDown={(e) => handleResizeStart(e, "sw")}
          />
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        hasOverlay
        onClickOutside={() => setIsModalOpen(false)}
        onEsc={() => setIsModalOpen(false)}
        className="modal"
      >
        <Layout className="modalHeader">
          <h2>Альтернативные сценарии</h2>
          <Button
            size="s"
            view="ghost"
            onlyIcon
            iconLeft={IconClose}
            onClick={() => setIsModalOpen(false)}
          />
        </Layout>
        <Tabs
          className="modalTabs"
          value={tab}
          onChange={setTab}
          items={tabs}
          getItemLabel={getItemLabel}
        />
        <div className="modalContent">
          <MainAppNode />
        </div>
        <div className="modalBar">
          <Button
            size="s"
            view="primary"
            label="Добавить сценарий в проект"
            onClick={() => {
              submitAltScenario()
              setIsModalOpen(false)
            }}
          />
          <Button
            size="s"
            view="secondary"
            label="Закрыть"
            onClick={() => {
              setIsModalOpen(false)
            }}
          />
        </div>
      </Modal>
    </>
  );
};

//// CONST

const QUICK_ACTIONS = [
  // { key: "read" as const, label: "Прочти граф" },
  { key: "alt" as const, label: "Альтернативные сценарии" },
  { key: "recommend" as const, label: "Рекомендация узла" },
];

type Item = {
  label: string;
  id: number;
  disabled: boolean;
  icon?: any;
};

const itemsSidebar: Item[] = [
  { label: "Архив", id: 1, disabled: false, icon: IconArchive },
  { label: "Новый проект", id: 2, disabled: false, icon: IconAddProject },
  { label: "Проект название 1", id: 3, disabled: false },
  { label: "Задача", id: 4, disabled: false },
];

const FILES = [{ key: "1" as const, extension: "csv" }];
