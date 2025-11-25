import {
  APP_CONFIG_FILE_URI,
  CONFIG_LOAD_ERROR_TEXT
} from './constants';
import type { AppConfigType } from './types';

// конфиг может быть undefined, но предполагается, что этого не будет,
// т.к. дерево компонентов-потребителей будет отрисовано только после успешной конфигурации
let appConfig: AppConfigType;

const checkConfigLoadStatus = (response: Response) => {
  if (response.status !== 200) {
    throw new Error();
  }
};

/**
 * асинхронная функция для начальной конфигурации приложения.
 * механизм действия:
 * 1) загрузить файл конфигурации;
 * 2) используя этот файл, сконфигурировать:
 *  2.1) axios;
 *  2.2) keycloak;
 *  2.3) gpnSpa;
 * 3) получаем данные пользователя и устанавливаем их в глобальный стейт;
 * 4) если конфигурация прошла успешно, то результатом промиса будет true.
 * 5) если на любом из шагов возникла ошибка, то выбрасывается исключение.
 *
 * @returns {Promise<true>}
 */
const configureApp = async (): Promise<true> => {
	// 1) загружаем конфиг. При ошибке в error записываем CONFIG_LOAD_ERROR_TEXT
	try {
		const response = await fetch(APP_CONFIG_FILE_URI);
		checkConfigLoadStatus(response);
		appConfig = await response.json();
		// TODO нужна проверка на случай ошибки парсинга
		// TODO написать проверку на наличие необходимых полей в appConfig
	} catch {
		throw new Error(CONFIG_LOAD_ERROR_TEXT);
	}

	return true;
};

export { configureApp, appConfig };
