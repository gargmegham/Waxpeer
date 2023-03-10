# SETUP

## Option 1: Using Docker

- Download docker on your system https://docs.docker.com/desktop/install/windows-install/
- If you encounter any problem related to virtualisation in bios enable virtualisation in your bios
- if any error related to wsl Open PowerShell as administrator ans run
  `wsl --update`
- Paste this source code to your `C:\` drive
- Open PowerShell and run this command:
  `cd C:\bot && docker-compose up -d --build`

## Option 2: Using Node

- Download and install node using https://nodejs.org/en/download/
- open powershell in bot directory
- run `npm install && npm run dev`

# Code Sharing

- Remove url from schema.prisma file before sharing code with others

# How to use

- Open localhost:3000 in browser and login with following atleast once
  password = `Jackson Wei`
  username = `admin`
- Define appropriate settings
- In inventory click `Add All`, 'Add Selected' or 'List from range' to add items to listings
