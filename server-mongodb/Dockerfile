FROM node:latest
WORKDIR /server-mongodb
ENV PORT = 4000
COPY package.json package-lock.json ./
RUN npm install && npm cache clean --force
COPY ./ ./
CMD ["npm", "run", "start"]