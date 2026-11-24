# FruitSense

FruitSense is a React, Express, and ThingSpeak dashboard for the ESP32 fruit-ripeness monitoring project. It displays real channel readings; it does not generate or fabricate sensor data.

## Requirements

- Node.js 18 or newer
- A ThingSpeak channel ID
- A ThingSpeak Read API Key for the channel

## Install

Run the following from the project root:

```powershell
npm install
npm install --prefix server
npm install --prefix client
```

## Configure the backend

Edit `server/.env`:

```text
THINGSPEAK_CHANNEL_ID=your_channel_id
THINGSPEAK_READ_API_KEY=your_read_api_key
PORT=5000
```

Keep the Read API Key only in `server/.env`. Never add it to React code or `VITE_*` variables.

## Run the application

Start both servers:

```powershell
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- Health check: `http://localhost:5000/api/health`

The dashboard requests the latest reading and up to 100 historical readings every 20 seconds.

## API endpoints

- `GET /api/sensor-data/latest`
- `GET /api/sensor-data/history?results=100`

## ThingSpeak field mapping

| Field | Meaning |
|---|---|
| field1 | Temperature (°C) |
| field2 | Humidity (%) |
| field3 | MQ-3 reading |
| field4 | MQ-135 reading |
| field5 | Ripeness score |
| field6 | Stage: 0 = RAW, 1 = RIPE, 2 = ROTTEN |

Missing values are returned as `null`. Connection, configuration, timeout, and missing-data states are shown in the UI.

## Project structure

```text
server/
  controllers/
  routes/
  services/
  server.js
client/
  src/
    components/
    hooks/
    services/
```
