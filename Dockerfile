ARG bun_image=oven/bun:slim

FROM $bun_image AS builder
WORKDIR /asya-sweets
COPY . .
RUN bun i --frozen-lockfile

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

RUN bunx prisma generate
RUN bun run build

FROM $bun_image AS runner
WORKDIR /asya-sweets
ENV NODE_ENV=production

COPY --from=builder /asya-sweets/.next/standalone .
COPY --from=builder /asya-sweets/.next/static ./.next/static

EXPOSE 3000
CMD ["bun", "server.js"]
