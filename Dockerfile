# Dockerfile для фронтенда
FROM node:18-alpine

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
RUN npm install

COPY . ./

# Построить приложение React
RUN npm run build

# Устанавливаем веб-сервер для статики
RUN npm install -g serve

EXPOSE 3000

# Запуск статики
# CMD ["serve", "-s", "build", "-l", "3000"]
CMD ["npm", "start"]
