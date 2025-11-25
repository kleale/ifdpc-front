import React from 'react';
import { useAppContext } from '../../contexts/AppContext';

interface Project {
  id: number;
  name: string;
}

interface NavigationItem {
  id: string;
  label: string;
}

const MainApp: React.FC = () => {
  const { 
    currentPage,
    isFormDirty,
    setCurrentPage, 
    setSelectedItem, 
    setIsFormDirty,
    setUserData 
  } = useAppContext();

  const navigation: NavigationItem[] = [
    { id: 'home', label: 'Главная' },
    { id: 'projects', label: 'Проекты' },
    { id: 'profile', label: 'Профиль' },
    { id: 'settings', label: 'Настройки' }
  ];

  const projects: Project[] = [
    { id: 1, name: 'Веб-сайт компании' },
    { id: 2, name: 'Мобильное приложение' },
    { id: 3, name: 'Дизайн система' }
  ];

  const handleProjectSelect = (project: Project): void => {
    setSelectedItem(project.name);
    setIsFormDirty(true);
  };

  const handleSave = (): void => {
    setIsFormDirty(false);
    setUserData(prev => ({ ...prev, lastSave: new Date().toISOString() }));
  };

  return (
    <div className="main-app">
      <nav className="app-nav">
        {navigation.map(item => (
          <button
            key={item.id}
            className={`nav-btn ${currentPage === item.id ? 'active' : ''}`}
            onClick={() => setCurrentPage(item.id)}
            type="button"
          >
            {item.label}
          </button>
        ))}
      </nav>

      <main className="app-content">
        <h1>Добро пожаловать в приложение!</h1>
        
        {currentPage === 'home' && (
          <div>
            <p>Это демонстрация контекстного помощника.</p>
            <button onClick={() => setIsFormDirty(true)} type="button">
              Сделать изменения
            </button>
            <button onClick={handleSave} disabled={!isFormDirty} type="button">
              Сохранить
            </button>
          </div>
        )}

        {currentPage === 'projects' && (
          <div>
            <h2>Ваши проекты</h2>
            <div className="projects-list">
              {projects.map(project => (
                <div 
                  key={project.id}
                  className="project-card"
                  onClick={() => handleProjectSelect(project)}
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e: React.KeyboardEvent) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleProjectSelect(project);
                    }
                  }}
                >
                  {project.name}
                </div>
              ))}
            </div>
          </div>
        )}

        {currentPage === 'profile' && (
          <div>
            <h2>Ваш профиль</h2>
            <button onClick={() => setUserData({ name: 'Пользователь' })} type="button">
              Заполнить профиль
            </button>
          </div>
        )}

        {currentPage === 'settings' && (
          <div>
            <h2>Настройки</h2>
            <p>Настройте параметры приложения</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default MainApp;