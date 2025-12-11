# Build stage
FROM oven/bun:1.3.3

WORKDIR /work

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile

COPY . .

RUN bun build --compile --target=node --outfile  ./dist/app src/index.ts


CMD ["/work/dist/app"]
