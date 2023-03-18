# SETUP

## Run On Server Using Docker

- Download docker on your system https://docs.docker.com/desktop/install/windows-install/
- If you encounter any problem related to virtualisation in bios enable virtualisation in your bios
- if any error related to wsl Open PowerShell as administrator ans run
  `wsl --update`
- `docker-compose up -d --build`

## Run Locally Using Node

- open powershell in bot directory
- run `npm run dev`

## For First Time Setup

- Download and install node using https://nodejs.org/en/download/
- Download and install PostgreSQL using https://www.postgresql.org/download/
- You'll need to create a local database in postgres with following details
  Username: 'postgres'
  Password: ''
  Database Name: 'pricebot'
- Or modify datasource in prisma/schema.prisma to use different database source
- Make sure you have node installed in you system with following command `node --version` `npm --version`
- Install dependecies with `npm install`
- Migrate tables with `npx prisma migrate dev`
