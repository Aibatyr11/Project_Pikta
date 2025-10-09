````markdown
# 🌐 Project Pikta

Проект **Pikta** — это социальная платформа / веб-приложение с функционалом публикаций, комментариев, чатов и системой аутентификации.  
Цель проекта — создание полноценного full-stack приложения с использованием **React** на фронтенде и **Django + DRF + Channels** на бэкенде, с хранением данных в **MongoDB**.

---

## 🧰 Технологии и стек

| Слой              | Технологии / библиотеки                                    |
|--------------------|------------------------------------------------------------|
| **Backend**        | Django, Django REST Framework (DRF), Channels, SimpleJWT   |
| **База данных**    | MongoDB, pymongo, dnspython, bson                          |
| **Frontend**       | React, React Router, Redux (или Context API)               |
| **Аутентификация** | JWT (JSON Web Tokens) через DRF SimpleJWT                 |
| **Чаты / WebSocket** | Django Channels для real-time сообщений                   |
| **Медиа и файлы**  | Django media-папка для хранения изображений и аватаров     |
| **Email восстановление** | Поддержка восстановления пароля через почту           |

---

## 🎯 Назначение проекта

**Pikta** предоставляет пользователям следующие возможности:

- 🔐 Регистрация и вход в систему  
- 📧 Восстановление пароля через email  
- 📝 Создание и редактирование публикаций (текст + изображение)  
- 💬 Комментирование публикаций  
- 💭 Общение в реальном времени через встроенный чат  
- 👤 Управление профилем пользователя (аватар, данные, настройки)  
- 📰 Просмотр ленты публикаций других пользователей  

> Это учебный / портфельный проект, демонстрирующий навыки **full-stack разработки**: от базы данных и API до интерактивного клиентского интерфейса.

---

## 📷 Скриншоты

![Главная страница](./screenshots/home.png)
![Профиль пользователя](./screenshots/profile.png)
![Чат](./screenshots/chat.png)

---

## 🏃 Как запустить проект локально

### 1. Клонирование репозитория
```bash
git clone https://github.com/Aibatyr11/Project_Pikta.git
cd Project_Pikta
````

### 2. Создание виртуального окружения и активация

```bash
python -m venv venv
# для Windows
venv\Scripts\activate
# для macOS / Linux
source venv/bin/activate
```

### 3. Установка зависимостей бэкенда

```bash
pip install -r backend/requirements.txt
```

*(Если `requirements.txt` находится в другом месте — поправь путь)*

### 4. Настройка базы данных и переменных окружения

* Убедись, что запущен **MongoDB** (локально или удалённо)
* В настройках Django (или `.env`) укажи URL подключения к MongoDB, например:

  ```
  MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/pikta
  ```
* Настрой **SECRET_KEY**, **CORS**, SMTP для восстановления пароля по email и т.д.

### 5. Миграции и создание суперпользователя

```bash
cd backend
python manage.py migrate
python manage.py createsuperuser
```

### 6. Запуск серверов

**Бэкенд (ASGI/Daphne):**

```bash
daphne samplesite.asgi:application --port 8000
```

**Фронтенд (React):**

```bash
cd ../frontend
npm install
npm start
```

После запуска:

* Фронтенд: [http://localhost:3000](http://localhost:3000)
* API / Бэкенд: [http://localhost:8000](http://localhost:8000)

---

## 🧩 Структура проекта

```
Project_Pikta/
├── backend/           # Серверная часть Django + DRF + Channels
├── frontend/          # Клиентская часть React
├── screenshots/       # Скриншоты для README
├── README.md
└── requirements.txt
```

---


```
```
