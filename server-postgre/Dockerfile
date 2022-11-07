FROM node:latest
WORKDIR /server-postgre
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm install && npm cache clean --force
COPY ./ ./
CMD ["npm", "run", "start"]