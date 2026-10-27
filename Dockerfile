# Используем официальный Node.js образ
FROM node:22-alpine

ENV SKIP_DB=true
ENV PRISMA_ENGINES_MIRROR="https://registry.npmmirror.com/-/binary/prisma"

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json / yarn.lock
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальные файлы проекта
COPY . .

# Генерация Prisma Client (если используется)
RUN npx prisma generate

# Отключаем телеметрию
RUN npx next telemetry disable

# Сборка проекта
RUN npm run build

# Указываем порт 
EXPOSE 3000

ENV NODE_ENV=production
ENV SKIP_DB=false
# Запуск приложения
CMD ["sh", "-c", "npm run admin & npx prisma migrate deploy && npm start"]
