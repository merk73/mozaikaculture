# Публикация сайта

## Быстрый вариант: GitHub + Netlify без регистрации

Сейчас сайт подготовлен именно для этого сценария.

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

Но для текущего релиза удобнее Netlify, потому что форма обратной связи уже настроена через Netlify Forms.

## Локальная проверка

```bash
npm start
```

Локально форма Netlify Forms не отправляет реальные сообщения. Это нормально: она заработает после публикации на Netlify.
