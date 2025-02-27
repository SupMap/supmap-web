# Étape 1 : Construction de l'application React
FROM node:18 as build-stage  
WORKDIR /app

# Copier les fichiers nécessaires pour l'installation des dépendances
COPY package*.json ./

# Installer les dépendances avec compatibilité legacy (évite les conflits avec certaines dépendances)
RUN npm install --legacy-peer-deps

# Copier le reste du code source
COPY . .

# Construire l’application React
RUN npm run build

# Étape 2 : Utiliser Nginx pour servir l'application en production
FROM nginx:alpine
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Exposer le port utilisé par Nginx
EXPOSE 80

# Lancer Nginx en mode daemon off
CMD ["nginx", "-g", "daemon off;"]
