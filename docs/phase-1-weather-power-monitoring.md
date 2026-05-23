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
- Power module for Grid/DG API integration
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
