FROM node:18-alpine
WORKDIR /app
COPY ./tsync-bot .
RUN npm install
RUN npm run build
ENV TZ="America/Argentina/Buenos_Aires"
EXPOSE 3000
CMD ["npm", "run", "start:prod"]