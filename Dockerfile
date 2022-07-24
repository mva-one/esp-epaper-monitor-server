FROM node:slim AS app

# do not install standalone chromium for puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# app directory inside container
WORKDIR /app

# install dependencies for puppeteer
RUN apt-get update && apt-get install curl gnupg -y \
  && curl --location --silent https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && sh -c 'echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
  && apt-get update \
  && apt-get install google-chrome-stable -y --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

# configure locale
RUN apt-get update && apt-get install locales tzdata -y
ENV TZ="Europe/Berlin"
RUN locale-gen --no-purge de_DE.UTF-8
ENV LANG=de_DE.UTF-8
ENV LC_TIME=de_DE.UTF-8

# install dependencies
COPY package.json ./
RUN npm install

# copy needed app files to the container
COPY . .

# open port 3003
EXPOSE 3003

# start app
ENTRYPOINT [ "node", "app.js" ]
#CMD [ "node", "app.js" ]