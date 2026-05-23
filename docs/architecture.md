# Architecture

PowerCast connects weather information with home power consumption data.

## Phase 1 flow

```text
Weather source
    |
    v
PowerCast Worker ---- Power consumption source
    |
    v
Analyzer
    |
    +--> Telegram alerts
    +--> Local database
    +--> Dashboard later
```

## Components

- Weather client: collects temperature, humidity and forecast data for Ghaziabad.
- Power client: collects Grid and DG consumption readings.
- Analyzer: compares weather and usage to explain high consumption.
- Notification service: sends Telegram summaries and alerts.
- Storage: keeps daily weather and power readings for trend analysis.

## Initial deployment target

- Self-hosted Docker setup
- Runs on the existing homelab server
- Can integrate with Home Assistant later
