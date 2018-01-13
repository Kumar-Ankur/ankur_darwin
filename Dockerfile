FROM ubuntu
# RUN echo "deb http://http.debian.net/debian/ squeeze main contrib non-free" >> /etc/apt/sources.list
# RUN echo "deb-src http://http.debian.net/debian/ squeeze main contrib non-free" >> /etc/apt/sources.list
# RUN echo "deb http://http.debian.net/debian squeeze-lts main contrib non-free" >> /etc/apt/sources.list
# RUN echo "deb-src http://http.debian.net/debian squeeze-lts main contrib non-free" >> /etc/apt/sources.list
# RUN echo "91.189.88.152 archive.ubuntu.com" >> /etc/hosts
RUN sed -i 's/http:\/\/archive.ubuntu.com\/ubuntu\//http:\/\/ubuntu.mirror.snu.edu.in\/ubuntu\//' /etc/apt/sources.list
RUN apt-get update
RUN apt-get install --fix-missing -y make unzip g++ libssl-dev git xvfb x11-xkb-utils xfonts-100dpi xfonts-75dpi xfonts-scalable xfonts-cyrillic x11-apps clang libdbus-1-dev libgtk2.0-dev libnotify-dev libgnome-keyring-dev libgconf2-dev libasound2-dev libcap-dev libcups2-dev libxtst-dev libxss1 libnss3-dev gcc-multilib g++-multilib xvfb vim curl build-essential libpng-dev
RUN curl -sL https://deb.nodesource.com/setup_9.x | bash -
RUN apt-get install -y nodejs
VOLUME [ "/app" ]
WORKDIR /app
COPY package.json /app
COPY . /app
RUN rm -rf node_modules
EXPOSE 3030 3000
CMD npm install; npm start; bash
