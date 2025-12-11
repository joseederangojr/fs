FROM oven/bun:1.3.3

ARG PORT=3000

WORKDIR /work

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile

COPY . .

RUN bun build --compile --bytecode --minify --outfile ./dist/app src/index.ts

EXPOSE ${PORT}

CMD ["/work/dist/app"]
