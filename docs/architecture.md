# Architecture

PowerCast connects weather information with home power consumption data.

## Phase 1 flow

```text
Weather source
    |
    v
NestJS PowerCast API/Worker ---- Power consumption source
    |
    v
Analyzer
    |
    +--> Telegram alerts
    +--> Optional local cache
    +--> Dashboard later
```

## Components

- NestJS application: hosts modules, scheduled jobs and future REST endpoints.
- Weather module: collects temperature, humidity and forecast data for Ghaziabad using Open-Meteo.
- Power module: collects Grid and DG consumption readings from the monthly chart API.
- Analyzer module: compares weather and usage to explain high consumption.
- Notification module: sends Telegram summaries and alerts.
- Scheduler module: runs daily jobs using NestJS Schedule.

## Database decision for Phase 1

A full database is not required for the first version.

Phase 1 can work by:

- Fetching the current month power data from the API
- Fetching current or daily weather data from Open-Meteo
- Calculating the latest day summary
- Sending Telegram notification

For basic duplicate prevention or debugging, a small JSON file can be used later, for example:

```text
./data/last-run.json
```

A real database should be added later when the project needs:

- Historical trend analysis
- Dashboard charts
- Billing ledger
- Recharge history
- Multi-flat support

## Initial deployment target

- Self-hosted Docker setup
- Runs on the existing homelab server
- Can integrate with Home Assistant later
