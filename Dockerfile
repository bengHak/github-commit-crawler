FROM node:15

# Update install os dep
RUN apt-get update && apt-get install -y apt-utils cron
RUN apt-get -y install pwgen python-setuptools curl git unzip vim

WORKDIR /app

COPY package*.json ./
COPY . .

ENV TZ=Asia/Seoul
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

ADD crontab /etc/cron.d/cjob
RUN chmod 0644 /etc/cron.d/cjob

RUN npm install

EXPOSE 3000