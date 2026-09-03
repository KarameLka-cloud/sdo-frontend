# СДО — фронтенд

Клиентская часть сервиса СДО: адаптация стажёров, обучающие материалы,
справочник сотрудников и админ-панель.

## 🚀 Технологии и стек

- **Язык**: [TypeScript](https://www.typescriptlang.org/)
- **Библиотека**: [React](https://react.dev/)
- **Роутинг**: [React Router](https://reactrouter.com/)
- **State-менеджмент**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **API-клиент**: [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)
- **Сборка**: [Vite](https://vitejs.dev/)
- **Стилизация**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Линтер**: [ESLint](https://eslint.org/)

## 📂 Структура проекта

```
sdo-frontend/
├── src/
│   ├── assets/           # Шрифты, изображения, глобальные стили
│   ├── components/
│   │   ├── protected/    # Ограничение доступа по роли
│   │   ├── resource-list/# Общий каркас списковых страниц (тулбар, таблица, статусы)
│   │   └── ui/           # shadcn-примитивы и собственные компоненты
│   ├── constants/        # Эндпоинты, роуты, тексты
│   ├── hooks/            # Кастомные хуки
│   ├── interfaces/api/   # Типы ответов API
│   ├── layouts/          # Каркасы страниц
│   ├── pages/            # Страницы по разделам
│   ├── routes/           # Роутинг (страницы грузятся лениво)
│   ├── services/store/   # Redux-стор и RTK Query
│   │   ├── baseApi.ts    # Единый API, фичи подключаются через injectEndpoints
│   │   └── features/     # Эндпоинты по доменам
│   ├── utils/            # Вспомогательные функции
│   └── main.tsx          # Точка входа
├── .env                  # VITE_BACKEND_LOCATION — адрес API
└── README.md
```

## ⚙️ Установка и запуск

1. Клонировать репозиторий и перейти в папку фронтенда:

   ```bash
   git clone <repo-url>
   cd sdo/sdo-frontend
   ```

2. Установить зависимости:

   ```bash
   npm install
   ```

3. Создать `.env` и указать адрес бэкенда:

   ```bash
   echo 'VITE_BACKEND_LOCATION=http://localhost:8000/' > .env
   ```

4. Запустить dev-сервер:

   ```bash
   npm run dev
   ```

5. Собрать production-версию:

   ```bash
   npm run build
   ```

## 🔐 Аутентификация

Токен Sanctum хранится в cookie `auth_token` и подставляется в заголовок
`Authorization` для всех запросов. Если сервер отвечает `401` (токен истёк или
отозван), сессия сбрасывается и происходит редирект на страницу входа.

## 🧪 Проверки

```bash
npm run lint      # ESLint
npx tsc -b        # проверка типов
npm run build     # сборка
```
