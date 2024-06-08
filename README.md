# Waxpeer Seller Bot [NOT MAINTAINED ANYMORE]

- Use [**ShieldPeer**](http://shieldpeer.in/) instead

This repository is a CSGO Steam Seller Bot built for the Waxpeer platform. It provides features such as login/logout, listing management, inventory management, and settings configuration. The bot allows users to add items from their inventory to listings, set API keys and rate limits, specify undercut prices, and more. The setup instructions include creating a .env.local file, installing Node.js and PostgreSQL, and running migrations. The bot can be run locally using npm or on a server using Docker.

### Demos

- ![Listings](https://github.com/gargmegham/Waxpeer/assets/95271253/84985d17-0ce3-46d2-be0b-89562164c1e6)

- ![Inventory](https://github.com/gargmegham/Waxpeer/assets/95271253/f4925bec-d35c-4af2-9698-d8ca5aa57ba3)

- ![Settings](https://github.com/gargmegham/Waxpeer/assets/95271253/ee1884f4-e1bf-4821-b2fa-dfeed4c16417)

### Features:

- Login/Logout
- Listing tab, inventory tab and a settings tab
- Add items from your inventory to listings using either from within a price range, add selected items or add all items at once
- From settings you can configure:
  - waxpeer API key
  - pricempire API key
  - API rate limits
  - frequency at which it lists
  - running/paused state
  - undercut by price
  - undercut by percentage
  - source for base price from priceempire
  - you can also specify different undercut prices for items within different price ranges
- From listings tab you can
  - Edit/Delete a listing
  - Read log for a listing

## Setup

### For First Time Setup

- Create a `.env.local` file in the root directory of this project with following keys

  ```
  SIGNATURE=
  DATABASE_URL=
  CRON_SECRET=
  ```

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

### Run Locally Using `npm`

- open powershell and go to code location then run `npm run dev`

### Run On Server Using Docker

- Download docker on your system https://docs.docker.com/desktop/install/windows-install/
- If you encounter any problem related to virtualisation in bios enable virtualisation in your bios
- if any error related to wsl Open PowerShell as administrator ans run
  `wsl --update`
- finally you can run `docker-compose up -d --build`
