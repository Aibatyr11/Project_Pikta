# Project Pikta

Проект **Pikta** — социальная платформа / приложение с функционалом публикаций, комментариев, чатов и авторизацией.  
Цель — создать законченное приложение, где фронтенд на React, бэкенд на Django + DRF + Channels, с хранением данных в MongoDB.

---

## 🧰 Технологии и стек

| Слой            | Технологии / библиотеки                          |
|------------------|--------------------------------------------------|
| Backend          | Django, Django REST Framework, Channels, SimpleJWT |
| База данных       | MongoDB, pymongo, dnspython, bson |
| Frontend         | React, (возможно библиотека маршрутизации, state management и т.д.) |
| Аутентификация    | JWT (JSON Web Tokens) via DRF SimpleJWT |
| WebSocket / Chat  | Django Channels для real-time коммуникаций |
| Загрузка файлов / медиа | Используется Django media-папка для хранения аватарок, загружаемых изображений |

---

## 🎯 Назначение проекта

- Позволяет пользователям регистрироваться и входить в систему  
- Создавать публикации (с изображениями, текстом)  
- Комментировать публикации  
- Общаться в режиме реального времени через чат  
- Управлять профилем пользователя  
- Просматривать ленту публикаций других пользователей  

Это — учебный / портфельный проект, демонстрирующий навыки full-stack разработки: от базы данных до клиентского интерфейса.

---

## 📷 Скриншоты


```markdown
![Главная страница](./screenshots/home.png)  
![Профиль пользователя](./screenshots/profile.png)  
![Чат](./screenshots/chat.png)



🏃 Как запустить проект локально

Ниже шаги, чтобы запустить и фронтенд, и бэкенд на своей машине.

1. Клонирование репозитория
git clone https://github.com/Aibatyr11/Project_Pikta.git
cd Project_Pikta

2. Создать виртуальное окружение и активировать его
python -m venv venv
# на Windows
venv\Scripts\activate
# на macOS / Linux
source venv/bin/activate

3. Установить зависимости бэкенда
pip install -r backend/requirements.txt

(Если requirements.txt в другом месте — поправь путь)

4. Настроить базу данных и переменные окружения
Убедись, что у тебя запущен MongoDB или действует удалённый сервер
В файле настроек Django укажи URL MongoDB (например, через MONGODB_URI)
Установи секретные ключи, настройки CORS и т.д. (в .env или settings.py)

5. Миграции и создание суперпользователя
cd backend
python manage.py migrate
python manage.py createsuperuser

6. Запуск серверов
Запусти бэкенд:
daphne samplesite.asgi:application --port 8000

Запусти фронтенд:
cd frontend
npm install
npm start

Теперь фронтенд должен быть доступен, например, по адресу http://localhost:3000, а API — http://localhost:8000.
