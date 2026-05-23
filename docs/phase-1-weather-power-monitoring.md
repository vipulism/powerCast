# Phase 1: Weather and Power Monitoring

Phase 1 builds the first useful version of PowerCast using NestJS.

## Objective

Connect Ghaziabad weather data with daily Grid and DG consumption data, then send useful summaries and basic alerts over Telegram.

## Technology choice

Use NestJS for Phase 1.

Recommended NestJS modules:

- Config module for environment variables
- Schedule module for daily jobs
- Weather module for Open-Meteo integration
- Usage module for Grid/DG API integration
- Analyzer module for simple rules
- Notification module for Telegram alerts

## Database decision

A full database is not required at the start of Phase 1.

The current power API already provides monthly data. Phase 1 can fetch the current month, select the latest available date, combine it with weather data, and send a summary.

For duplicate prevention or operational tracking, the app may later use a small JSON file such as:

```text
./data/last-run.json
```

A real database can be added later when dashboard charts, trend history, multi-flat support, recharge ledger, or billing analysis are introduced.

## Inputs

### Weather data

Required fields:

- Date
- Location
- Current temperature
- Maximum temperature
- Minimum temperature
- Humidity if available
- Weather condition or weather code
- Forecast summary

### Power data

Required fields:

- Date
- Grid units
- DG units
- Total units
- Raw API response snapshot if needed for debugging

## Weather endpoint

Phase 1 exposes an Open-Meteo backed endpoint:

```text
GET /api/weather/today
```

It uses these variables:

```env
WEATHER_PROVIDER=open-meteo
LOCATION_NAME=Ghaziabad
LOCATION_LAT=
LOCATION_LON=
```

`LOCATION_LAT` and `LOCATION_LON` must be set in GitHub repository variables and local `.env` before the endpoint can return live weather data.

## Usage endpoints

Phase 1 exposes power usage endpoints backed by the monthly chart API:

```text
GET /api/usage/today
GET /api/usage/monthly?month=2026-05
```

They use these variables:

```env
POWER_API_BASE_URL=https://mp.adwards.in
POWER_API_MONTHLY_CHART_PATH=/Prepaid_data_daily_log_gridHelper/get_daily_chart_data
POWER_API_CONSUMER_ID=500152051201
POWER_API_FLAT_NUMBER=1201
```

Monthly endpoint format:

```text
{POWER_API_BASE_URL}{POWER_API_MONTHLY_CHART_PATH}/{POWER_API_CONSUMER_ID}/{YYYY-MM}
```

## Summary endpoint

Phase 1 combines weather, usage and analyzer output into a single endpoint:

```text
GET /api/summary/today
```

This endpoint is the base for on-demand updates and future Telegram summaries.

## Daily summary

Example:

```text
PowerCast Daily Summary
Location: Ghaziabad
Max Temp: 41 C
Grid Usage: 14.8 units
DG Usage: 0.7 units
Observation: Hot day. AC usage may be the main reason for higher consumption.
```

## Basic rules

Initial rules can be simple:

- If max temperature is greater than 38 C, mark the day as hot.
- If Grid usage is higher than a configurable threshold, mark usage as high.
- If DG usage is greater than zero, include DG notice.
- If weather API or power API fails, send a missing data alert.

## Success criteria

Phase 1 is complete when:

- NestJS app runs locally and in Docker.
- Weather data is fetched successfully.
- Power consumption data is fetched successfully.
- Telegram summary is sent.
- Basic high usage alert works.
- GitHub Actions deploys the app to the homelab.
