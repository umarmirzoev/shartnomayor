# ШартномаЁр — запуск фронтенда и бэкенда вместе (реальный режим)

Я свёл фронтенд (`shartnomayor-source`) и бэкенд (`бекендшартнома/Shartnoma/Backend`) в одну связку:
исправил реальный баг в экспорте .docx/PDF (фронтенд неправильно читал ответ бэкенда) и подготовил
рабочие конфиги для локального запуска. Ниже — что нужно поставить и как запустить, чтобы это
реально работало через настоящий API, а не через localStorage.

Собрать и запустить бэкенд у себя в облачной песочнице я не смог: здесь нет доступа к nuget.org
(разрешены только npm/pypi), поэтому `dotnet restore` физически не может скачать пакеты. Все проверки
ниже сделаны построчной сверкой кода (маршруты, DTO, конверт ответа, енумы) между `src/lib/api.ts`
и контроллерами/DTO бэкенда — реальный прогон нужно будет сделать у вас на компьютере, где есть интернет.

## Что нужно установить (Docker у вас не стоит, поэтому — нативно)

1. **.NET 9 SDK** — https://dotnet.microsoft.com/download/dotnet/9.0 (Windows x64 installer).
2. **PostgreSQL 16** — https://www.postgresql.org/download/windows/. При установке задайте пароль
   пользователя `postgres` = `postgres` (или другой — тогда поправьте `Password=` в
   `Backend/WebApi/appsettings.Development.json`). После установки создайте базу:
   ```
   createdb -U postgres Shartnoma
   ```
3. **Redis-совместимый сервер** — на Windows нет официальной сборки Redis, проще всего:
   **Memurai Developer** (бесплатная, полностью совместима с Redis) — https://www.memurai.com/get-memurai.
   Ставится как обычная служба Windows и слушает `localhost:6379` из коробки — трогать конфиг не нужно.
4. **MinIO** (S3-совместимое хранилище документов, без Docker — обычный exe) —
   https://min.io/download (Windows). Запустите так, чтобы ключи совпали с
   `appsettings.Development.json`:
   ```
   set MINIO_ROOT_USER=shartnoma-dev
   set MINIO_ROOT_PASSWORD=shartnoma-dev-secret
   minio.exe server C:\minio-data --console-address ":9001"
   ```
   Откройте консоль http://localhost:9001 (логин/пароль — те же), создайте приватный бакет с именем
   `shartnoma-documents`. Без этого бакета создание/экспорт черновиков будет падать с ошибкой.
5. **Gemini API-ключ** (для настоящей ИИ-сборки черновика) — бесплатно получить в
   https://aistudio.google.com/apikey. Вставьте его в `Backend/WebApi/appsettings.Development.json`
   в `Gemini.ApiKey`. Без ключа всё остальное (клиенты, дела, шаблоны, вход) будет работать, но
   создание/перегенерация черновика через ИИ — нет, бэкенд физически шлёт запрос в Gemini.

## Что я уже настроил за вас

- `Backend/WebApi/appsettings.Development.json` — строка подключения к Postgres, JWT-ключ
  (сгенерирован случайно, годен только для локальной разработки), Redis, MinIO-реквизиты,
  CORS для `http://localhost:5173`, и включённый bootstrap-администратор:
  - email: `admin@shartnomayor.local`
  - пароль: `Shartnoma_Admin_95b9c815!A1`
  (под этим аккаунтом можно зайти в `/app/login` и, отдельно, загрузить библиотеку шаблонов —
  см. ниже).
- `.env` фронтенда — `VITE_API_URL=http://localhost:5292` (боевой режим вместо localStorage).
- `src/lib/api.ts` и `src/pages/app/DraftEditor.tsx` — исправлен экспорт документа: бэкенд отдаёт
  файл base64-строкой внутри обычного JSON-конверта (не сырыми байтами), фронтенд раньше пытался
  превратить весь JSON-ответ в Blob — итоговый .docx был бы битым. Теперь декодируется правильно.

## Запуск

```powershell
# 1) Бэкенд (порт 5292, без миграций миграции применятся/база создастся автоматически)
cd Backend\WebApi
dotnet run --launch-profile http
# проверить: http://localhost:5292/swagger

# 2) Фронтенд (в отдельном терминале)
cd shartnomayor-source
npm install
npm run dev
# открыть http://localhost:5173 — приложение уже в боевом режиме (VITE_API_URL задан)
```

Зарегистрируйте нового юриста через `/app/login` → «Регистрация» — это реальный `POST
/api/v1/Authentication/register`, запись попадёт в Postgres.

## Наполнить библиотеку шаблонов (бэкенд намеренно не сидирует юридический контент)

```powershell
cd shartnomayor-source
node scripts/seed-backend.mjs --url http://localhost:5292 --email admin@shartnomayor.local --password "Shartnoma_Admin_95b9c815!A1"
```

Это зальёт тот же набор шаблонов/пунктов, что был в демо-режиме, но уже через настоящие
`POST /Templates` и `POST /ClauseBlocks` от имени куратора.

## Что дальше проверить самим

Я вычитал построчно все эндпоинты, которые реально дёргает фронтенд (`Authentication`, `Clients`,
`Cases`, `Templates`, `ClauseBlocks`, `Documents`, `ArtificialIntelligence`, `Legislation`, `Audit`) —
маршруты, тела запросов, DTO и енумы совпадают. `CommentsController` и `SignaturesController` есть на
бэкенде, но фронтенд их вообще не вызывает — это отдельная незадействованная функциональность, если
она вам нужна, её ещё предстоит подключить в UI.

Единственное, что я не смог проверить сам — реальный сквозной прогон (регистрация → логин → клиент →
дело → черновик → экспорт) с настоящими Postgres/Redis/MinIO/Gemini, так как в этой песочнице нет
доступа к NuGet. Прогоните этот сценарий у себя после запуска — если что-то не сойдётся, пришлите мне
текст ошибки, разберёмся.
