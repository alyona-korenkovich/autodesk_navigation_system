FROM node:16

COPY ["package.json", "package-lock.json", "./"]
RUN npm install
COPY ../../Desktop/BAM .
EXPOSE 5000
CMD ["npm", "start"]