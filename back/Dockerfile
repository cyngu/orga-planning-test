FROM node:20.11-alpine

# Définit le répertoire de travail
WORKDIR /usr/src/app/

# Copie tous les fichiers du projet
COPY . .

# Installe les dependances du projet
RUN yarn install

RUN npx prisma generate

# Compile le projet si nécessaire
RUN yarn build

#Definie le port de l'app
EXPOSE 3001

# Commande pour lancer l'app
CMD ["yarn", "start:prod"]
