FROM node:20.11-alpine

WORKDIR /usr/src/app/

COPY . .

RUN npm install

RUN npm run build

EXPOSE 3000

# Set the volume for the static app so that a proxy (NGiNX)
# can read files and serve them statically
# VOLUME /usr/src/app/build

ENTRYPOINT ["npm", "run", "start"]
