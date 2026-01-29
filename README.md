# ryancoakley.com

Personal website with live weather data and ADS-B radar.

## Stack

- React + Vite
- Tailwind CSS
- Hosted on Cloudflare Pages

## Features

- **Weather** — Live data from Tempest WeatherFlow station
- **Radar** — Real-time ADS-B aircraft tracking from Pi

## Development

```bash
npm install
npm run dev
```

## Deploy

```bash
npm run build
npx wrangler pages deploy dist --project-name ryancoakley-site
```
