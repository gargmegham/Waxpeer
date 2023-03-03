FROM node:16.16

WORKDIR /app

COPY package.json .

COPY . .

RUN npm install --silent

# RUN npx prisma migrate deploy

# RUN npm run build

# CMD npm start 

CMD npm run dev 

