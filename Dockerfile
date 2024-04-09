FROM node:16-alpine
WORKDIR  /usr/src/app
COPY  package.json ./
RUN npm install --force                                                                                                                                
COPY . .
EXPOSE 31503
CMD ["node" , "bin/validator.js"]
