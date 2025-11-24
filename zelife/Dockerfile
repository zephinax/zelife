FROM oven/bun:latest as builder

WORKDIR /app

RUN apt update && apt install -y \
  git \
  build-essential \
  autoconf \
  automake \
  libtool \
  bash \
  && rm -rf /var/lib/apt/lists/*

COPY bun.lock package.json ./

RUN bun install

COPY . .

COPY public ./public

RUN bun run build

FROM oven/bun:latest

WORKDIR /app

COPY --from=builder /app/dist ./dist

EXPOSE 5035

CMD ["bun", "x", "serve", "-s", "dist", "-l", "5035"]
