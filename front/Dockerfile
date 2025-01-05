# Install dependencies
FROM node:20.11-alpine AS deps
WORKDIR /usr/src/app/
COPY package*.json ./
RUN npm install

# Build application
FROM node:20.11-alpine AS builder
WORKDIR /usr/src/app/
COPY . .
COPY --from=deps /usr/src/app/node_modules ./node_modules
ENV NEXT_PUBLIC_API_URL=NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL_SSO=NEXT_PUBLIC_API_URL_SSO
ENV NEXT_PUBLIC_API_KEY=NEXT_PUBLIC_API_KEY
ENV NEXT_PUBLIC_SUPER_ADMIN_ID=NEXT_PUBLIC_SUPER_ADMIN_ID
ENV NEXT_PUBLIC_ADMIN_ID=NEXT_PUBLIC_ADMIN_ID
ENV NEXT_PUBLIC_ENTREPRISE_ID=NEXT_PUBLIC_ENTREPRISE_ID
ENV NEXT_PUBLIC_JWT_PUBLIC_KEY=NEXT_PUBLIC_JWT_PUBLIC_KEY
RUN npm run build && npm prune --production

# Final runtime image
FROM node:20.11-alpine AS runner
WORKDIR /usr/src/app/
COPY --from=builder /usr/src/app/.next ./.next
# COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY entrypoint.sh /usr/bin/

RUN chmod +x /usr/bin/entrypoint.sh
EXPOSE 3000
ENTRYPOINT ["sh", "/usr/bin/entrypoint.sh"]

# Set the volume for the static app so that a proxy (NGiNX)
# can read files and serve them statically
# VOLUME /usr/src/app/build
