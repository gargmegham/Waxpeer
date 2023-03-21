# SETUP

## For First Time Setup

- Download and install node using https://nodejs.org/en/download/
- Download and install PostgreSQL using https://www.postgresql.org/download/
- You'll need to create a local database in postgres with following details
  Username: 'postgres'
  Password: ''
  Database Name: 'pricebot'
  To create a database you can follow this blog: https://www.sqlshack.com/how-to-install-postgresql-on-windows/
- Or to use different database source modify datasource in prisma/schema.prisma (Optional)
- Make sure you have node installed in you system with following command
  `node --version`
  `npm --version`
- Install dependecies with `npm install`
- Create and migrate tables with `npx prisma migrate dev`

## Run Locally Using Node

- open powershell and go to code location then run `npm run dev`

## Run On Server

### Using Docker

- Download docker on your system https://docs.docker.com/desktop/install/windows-install/
- If you encounter any problem related to virtualisation in bios enable virtualisation in your bios
- if any error related to wsl Open PowerShell as administrator ans run
  `wsl --update`
- finally you can run `docker-compose up -d --build`

### Using pm2

- `npm install pm2 -g`
- `npm run build`
- `pm2 start npm --name "next-js" -- start`
- `pm2 startup`
- `pm2 save`
