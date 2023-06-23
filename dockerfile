FROM arm64v8/node:20-alpine

COPY ./ /app
WORKDIR /app

RUN npm install -g node-gyp
RUN npm install