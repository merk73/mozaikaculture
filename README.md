# Мозаика культур

Статический образовательный сайт о коренных народах Дальнего Востока.

## Текущий режим публикации

Сайт подготовлен для бесплатной публикации через GitHub Pages и может также собираться на Netlify/Vercel:

- регистрация работает через Supabase Auth при наличии переменных окружения;
- форма обратной связи отправляет сообщения в таблицу Supabase;
- GitHub Actions собирает `dist` и публикует сайт на GitHub Pages.

## Локальный запуск

```bash
npm start
```

Сайт откроется на `http://127.0.0.1:4173`.

## Сборка

```bash
npm run build
```

Готовые файлы появятся в папке `dist`. Эту папку не нужно загружать в GitHub: GitHub Actions соберет ее сам.

## Netlify

При подключении репозитория укажите:

```text
Build command: npm run build
Publish directory: dist
```

Для регистрации и обратной связи добавьте переменные окружения:

```text
SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
SUPABASE_ANON_KEY=YOUR_PUBLIC_ANON_KEY
```

## Supabase на будущее

SQL для таблицы обратной связи лежит в `supabase-setup.sql`. Подробная инструкция находится в `DEPLOY.md`.
