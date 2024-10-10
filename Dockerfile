# build stage
FROM node:lts-iron as build-stage

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm config set registry https://registry.npmmirror.com/ \
  && npm i pnpm -g \
  && pnpm install

COPY . .

RUN pnpm build

# production stage
FROM nginx:latest as production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
