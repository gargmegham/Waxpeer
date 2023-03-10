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

## For external users

- You'll need to put connection url in schema.prisma to some postgres database
- And run `npx prisma migrate dev` `npx prisma db push` `npx prisma deploy`
- After that add one row user and settings table through below SQL
  ```
    INSERT INTO public."User"
    (id, email, "name", "password", username, "botLastRun", "priceEmpireLastRun", "floatBotLastRun")
    VALUES (1, 'abc@gmail.com', 'Abc', 'Jackson Wei', 'admin', '2023-03-10 02:49:01.885', '2023-03-10 02:49:02.817', NULL);
  ```
  ```
  INSERT INTO public."Settings"
  (id, "userId", "waxpeerApiKey", "waxpeerRateLimit", "priceEmpireApiKey", "priceEmpireRateLimit", "source", "undercutPrice", "undercutPercentage", "undercutByPriceOrPercentage", paused, "noOfItemsRoListAtATime", "floatBotFrequency")
  VALUES(1, 1, 'xyz...', 1, 'zyx...', 1, 'buff', 0.1, 1.0, 'price', false, 50, 30);
  ```

# How to use

- Open localhost:3000 in browser and login with following atleast once
  password = `Jackson Wei`
  username = `admin`
- Define appropriate settings
- In inventory click `Add All`, 'Add Selected' or 'List from range' to add items to listings
