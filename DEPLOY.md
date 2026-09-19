# Публикация сайта

## Текущий сайт: GitHub Pages

Репозиторий: `merk73/mozaikaculture`. Публикация уже настроена в `.github/workflows/deploy-pages.yml`.

1. Выполните `npm run build`: готовый сайт будет в `dist`.
2. Загрузите изменения исходников и новые изображения в ветку `main`.
3. Workflow **Deploy to GitHub Pages** соберёт `dist` и опубликует его. Также доступен ручной запуск `workflow_dispatch`.

Папки `dist`, `node_modules` и локальные файлы `.env` коммитить не нужно. Для этого обновления не требуется менять настройки Pages или существующие секреты репозитория.

Общие стили меню находятся в `site-shell.css`, поведение мобильного меню — в `home-nav.js`, оформление главной — в `home.css`. Эти файлы и новые изображения включены в сборку. Ссылки на страницы и ресурсы относительные, поэтому сайт работает под путём репозитория на GitHub Pages.

Локальная сборка без переменных окружения не подтверждает работу входа и отправки формы на опубликованном сайте.

## Другие варианты размещения

## Быстрый вариант: GitHub + Netlify без регистрации

Альтернативный сценарий размещения; текущая публикация использует GitHub Pages.

1. Создайте репозиторий на GitHub.
2. Загрузите в него файлы проекта. Папку `dist` загружать не нужно.
3. Откройте Netlify -> Add new site -> Import an existing project.
4. Выберите репозиторий GitHub.
5. Укажите:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Переменные окружения не добавляйте.
7. Нажмите Deploy.

В этом режиме регистрация скрыта, а сообщения из формы будут появляться в Netlify -> Forms.

## Подключение Supabase позже

Когда понадобится регистрация:

1. Создайте проект на Supabase.
2. Откройте SQL Editor и выполните код из `supabase-setup.sql`.
3. В Authentication -> Providers включите Email.
4. В Authentication -> URL Configuration добавьте адрес опубликованного сайта.
5. В Project Settings -> API скопируйте:
   - Project URL
   - anon public key

На Netlify создайте переменные:

```text
SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
SUPABASE_ANON_KEY=YOUR_PUBLIC_ANON_KEY
```

После этого регистрация появится автоматически. Форма обратной связи начнет писать в Supabase вместо Netlify Forms.

## Vercel

Vercel тоже поддерживается:

```text
Build command: npm run build
Output directory: dist
```

Для текущего сайта используется GitHub Pages через существующий workflow.

## Локальная проверка

```bash
npm start
```

Локально форма Netlify Forms не отправляет реальные сообщения. Это нормально: она заработает после публикации на Netlify.
