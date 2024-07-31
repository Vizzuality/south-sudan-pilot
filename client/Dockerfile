FROM node:20.5-bullseye-slim
RUN apt-get update -y && \
    apt-get upgrade -y && \
    apt-get install -y libc6  && \
    apt-get clean

ENV NODE_ENV development
ENV NEXT_TELEMETRY_DISABLED 1
ENV PORT 3000

WORKDIR /app

COPY public ./public
COPY src ./src

COPY .browserslistrc \
     .env.local \
     next.config.mjs \
     package.json \
     postcss.config.mjs \
     README.md \
     tailwind.config.ts \
     tsconfig.json \
     yarn.lock \
     ./

RUN yarn install

RUN chown -R node:node /app
USER node

EXPOSE 3000
ENTRYPOINT ["/app/entrypoint.sh"]
