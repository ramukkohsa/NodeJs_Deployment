#FROM   node:13-alpine
FROM 805392809179.dkr.ecr.ap-south-1.amazonaws.com/nodejs-base-image:latest
ENV MONGO_DB_USERNAME=admin \
    MONGO_DB_PWD=password
RUN mkdir -p /home/app
COPY . /home/app
WORKDIR /home/app
RUN npm install
CMD ["node", "server.js"]