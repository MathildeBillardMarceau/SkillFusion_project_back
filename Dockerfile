FROM node:22-alpine

RUN apk add --no-cache bash
RUN corepack enable && corepack prepare pnpm@latest --activate

# Définir un espace de travail
# Convention pour les projet Node.js
# Le dossier de travail est souvent `/app`
WORKDIR /app

# Installer les dépendances (Certains fichiers ne devraient pas être copié : .dockerignore)
COPY package*.json pnpm-lock.yaml ./
RUN pnpm install

# Copier tout le code source
COPY . .

# Générer Prisma (client)
# RUN pnpm run db:generate

# Créer le build de production
# RUN pnpm run build

# Exposer le port de l'API
EXPOSE 4000

# Lancer l'application en prod
# CMD ["pnpm", "run", "docker:start"]

# Lancer l'application en dev
CMD ["pnpm", "dev"]