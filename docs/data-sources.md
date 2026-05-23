# Data Sources

PowerCast Phase 1 uses two data sources:

1. Weather data for Ghaziabad
2. Power consumption data for Grid and DG usage

The goal is to compare weather conditions with daily power consumption and send useful Telegram summaries and alerts.

## Weather data

Phase 1 will start with Open-Meteo.

Reason:

- No API key required for the initial version
- Simple forecast API
- Good enough for temperature and weather-based power usage analysis

Location: Ghaziabad, Uttar Pradesh, India.

Required weather fields:

- Date
- Current temperature
- Maximum temperature
- Minimum temperature
- Humidity if available
- Weather condition or weather code
- Forecast summary

Environment variables:

```env
WEATHER_PROVIDER=open-meteo
LOCATION_NAME=Ghaziabad
LOCATION_LAT=
LOCATION_LON=
```

`LOCATION_LAT` and `LOCATION_LON` should be set from the selected Ghaziabad coordinates during deployment.

## Power consumption data

PowerCast will use the existing monthly chart endpoint.

Working endpoint example:

```text
https://mp.adwards.in/Prepaid_data_daily_log_gridHelper/get_daily_chart_data/500152051201/2026-05
```

Endpoint pattern:

```text
{POWER_API_BASE_URL}{POWER_API_MONTHLY_CHART_PATH}/{POWER_API_CONSUMER_ID}/{YYYY-MM}
```

Default values for Phase 1:

```env
POWER_API_BASE_URL=https://mp.adwards.in
POWER_API_MONTHLY_CHART_PATH=/Prepaid_data_daily_log_gridHelper/get_daily_chart_data
POWER_API_CONSUMER_ID=500152051201
POWER_API_FLAT_NUMBER=1201
```

## Flat number rule

The current consumer ID is:

```text
500152051201
```

The last four digits represent the flat number:

```text
1201
```

PowerCast should keep the flat number as a separate variable:

```env
POWER_API_FLAT_NUMBER=1201
```

This is important because future versions may support multiple flats, profiles, or consumer IDs.

## Expected power API response

The monthly API is expected to return arrays similar to:

```json
{
  "date": [],
  "grid": [],
  "dg": []
}
```

Phase 1 logic:

- Fetch the current month using `YYYY-MM`
- Read the latest available date
- Extract Grid units for that date
- Extract DG units for that date
- Compare usage with weather data
- Send Telegram summary

## Environment variables

```env
# Weather
WEATHER_PROVIDER=open-meteo
LOCATION_NAME=Ghaziabad
LOCATION_LAT=
LOCATION_LON=

# Power API
POWER_API_BASE_URL=https://mp.adwards.in
POWER_API_MONTHLY_CHART_PATH=/Prepaid_data_daily_log_gridHelper/get_daily_chart_data
POWER_API_CONSUMER_ID=500152051201
POWER_API_FLAT_NUMBER=1201
```

## Secrets and privacy

This is a public repository. Do not commit:

- Telegram bot token
- Telegram chat ID
- Private API tokens
- Cookies
- Personal recharge records
- Billing screenshots
- Any private society credentials

If a value is sensitive, keep it in GitHub Actions secrets or local `.env` only.
