FROM node:20.11-bookworm-slim
# Install dependencies
RUN apt-get update -y && \
    apt-get upgrade -y && \
    apt-get install -y \
      build-essential \
      gcc autoconf \
      automake \
      zlib1g-dev \
      libpng-dev \
      nasm bash \
      libvips-dev \
    && apt-get clean

ENV NODE_ENV development

WORKDIR /app

COPY .yarn ./.yarn
COPY config ./config
COPY database ./database
COPY public ./public
COPY src ./src

COPY .nvmrc \
    .yarnrc.yml \
     favicon.png \
     package.json \
     entrypoint.sh \
     tsconfig.json \
     yarn.lock \
     ./

RUN yarn install

ENV PATH /app/node_modules/.bin:$PATH


RUN chown -R node:node /app
USER node
EXPOSE 1337
ENTRYPOINT ["/app/entrypoint.sh"]
