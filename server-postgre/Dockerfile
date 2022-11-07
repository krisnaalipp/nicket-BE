FROM node:latest
WORKDIR /server-postgre
ENV PORT = 4003
COPY package.json package-lock.json ./
RUN npm install && npm cache clean --force
COPY ./ ./
CMD ["npm", "run", "start"]