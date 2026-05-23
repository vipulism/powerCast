# Phase 1: Weather and Power Monitoring

Phase 1 builds the first useful version of PowerCast.

## Objective

Connect Ghaziabad weather data with daily Grid and DG consumption data, then send useful summaries and basic alerts over Telegram.

## Inputs

### Weather data

Required fields:

- Date
- Location
- Current temperature
- Maximum temperature
- Minimum temperature
- Humidity
- Weather condition
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
- If Grid usage is higher than the recent average, mark usage as high.
- If DG usage is greater than zero, include DG notice.
- If weather API or power API fails, send a missing data alert.

## Storage

Store one row per day:

- date
- max_temp_c
- min_temp_c
- humidity
- grid_units
- dg_units
- total_units
- notes
- created_at

## Success criteria

Phase 1 is complete when:

- Weather data is fetched successfully.
- Power consumption data is fetched successfully.
- Daily values are stored locally.
- Telegram summary is sent.
- Basic high usage alert works.
