# PriceEmpire & Waxpeer based bot

1. get source prices from priceempire
2. update prices on waxpeer based in settings

## Available settings

- waxpeerApiKey
- waxpeerRateLimit
- priceEmpireApiKey
- priceEmpireRateLimit
- source
- undercutPrice
- undercutPercentage
- undercutByPriceOrPercentage
- paused

## Available price range options

- sourcePriceMin
- sourcePriceMax
- priceRangeMin
- priceRangeMax
- priceRangePercentage
- whenNoOneToUndercutListUsing

### Command to deploy

```
docker-compose up -d --build
```

### SETUP

- Download node on your system https://nodejs.org/en/download/
- Open terminal goto project directory and run: npm install && npm run dev
