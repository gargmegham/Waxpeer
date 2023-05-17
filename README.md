## Overview

Features:
* Login/Logout
* Listing tab, inventory tab and a settings tab
* Add items from your inventory to listings using either from within a price range, add selected items or add all items at once
* From settings you can configure:
  - waxpeer API key
  - pricempire API key
  - API rate limits
  - frequency at which it lists
  - running/paused state
  - undercut by price
  - undercut by percentage
  - source for base price from priceempire
  - you can also specify different undercut prices for items within different price ranges
* From listings tab you can
  - Edit/Delete a listing
  - Read log for a listing


## Setup

### For First Time Setup

- Create a `.env.local` file in the root directory of this project with following keys

  ```
  SIGNATURE=
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
