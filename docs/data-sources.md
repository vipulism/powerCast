# Data Sources

PowerCast Phase 1 needs two data sources: weather data and power consumption data.

## Weather data

Location: Ghaziabad, Uttar Pradesh, India.

Candidate data points:

- Current temperature
- Maximum temperature
- Minimum temperature
- Humidity
- Weather condition
- Forecast for the day

The exact weather provider will be selected during implementation.

## Power consumption data

PowerCast will use the existing power consumption API available to the user.

Expected daily data:

- Date
- Grid units
- DG units

Known monthly chart endpoint pattern:

```text
/Prepaid_data_daily_log_gridHelper/get_daily_chart_data/{consumer_id}/{YYYY-MM}
```

The consumer identifier and full endpoint should be stored in environment variables and never committed to the repository.

## Environment variables

```env
POWER_API_BASE_URL=
POWER_API_CONSUMER_ID=
WEATHER_PROVIDER=
WEATHER_API_KEY=
LOCATION_NAME=Ghaziabad
LOCATION_LAT=
LOCATION_LON=
```

## Data privacy

Do not commit real consumer IDs, tokens, API keys, recharge data, or personal billing records.
