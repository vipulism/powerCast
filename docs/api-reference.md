# API Reference

PowerCast exposes a small REST API for Phase 1 monitoring, summaries, alerts, Telegram delivery, Home Assistant integration, and Swagger/OpenAPI documentation.

Base URL on homelab:

```text
http://localhost:61209/api
```

## Swagger / OpenAPI

### GET /api/docs

Opens Swagger UI in the browser.

```text
http://localhost:61209/api/docs
```

On LAN, replace localhost with the PowerCast host IP:

```text
http://192.168.1.32:61209/api/docs
```

### GET /api/docs-json

Returns the OpenAPI JSON document.

```bash
curl http://localhost:61209/api/docs-json
```

## Health

### GET /api/health

Checks whether the PowerCast service is running.

```bash
curl http://localhost:61209/api/health
```

Example response:

```json
{
  "status": "ok",
  "service": "powercast",
  "timestamp": "2026-05-24T00:00:00.000Z"
}
```

## Weather

### GET /api/weather/today

Returns today's weather for the configured location using Open-Meteo.

```bash
curl http://localhost:61209/api/weather/today
```

Example response:

```json
{
  "location": "Ghaziabad",
  "provider": "open-meteo",
  "currentTempC": 33.6,
  "maxTempC": 41,
  "minTempC": 31.8,
  "humidity": 18,
  "condition": "clear sky"
}
```

Required variables:

```env
WEATHER_PROVIDER=open-meteo
LOCATION_NAME=Ghaziabad
LOCATION_LAT=
LOCATION_LON=
```

## Usage

### GET /api/usage/today

Returns the latest available Grid/DG usage from the current month.

```bash
curl http://localhost:61209/api/usage/today
```

Example response:

```json
{
  "consumerId": "500152051201",
  "flatNumber": "1201",
  "date": "2026-05-24",
  "gridUnits": 1,
  "dgUnits": 0,
  "totalUnits": 1
}
```

### GET /api/usage/monthly?month=YYYY-MM

Returns all available Grid/DG daily usage entries for the given month.

```bash
curl "http://localhost:61209/api/usage/monthly?month=2026-05"
```

Invalid month values return a `400 Bad Request` response.

```bash
curl "http://localhost:61209/api/usage/monthly?month=bad"
```

Example invalid response:

```json
{
  "message": "month must be in YYYY-MM format",
  "error": "Bad Request",
  "statusCode": 400
}
```

Required variables:

```env
POWER_API_BASE_URL=https://mp.adwards.in
POWER_API_MONTHLY_CHART_PATH=/Prepaid_data_daily_log_gridHelper/get_daily_chart_data
POWER_API_CONSUMER_ID=500152051201
POWER_API_FLAT_NUMBER=1201
```

## Summary

### GET /api/summary/today

Returns weather, usage, analysis, and alerts in a single response.

```bash
curl http://localhost:61209/api/summary/today
```

### POST /api/summary/today/send

Sends the current daily summary to Telegram on demand.

```bash
curl -X POST http://localhost:61209/api/summary/today/send
```

Required secrets:

```env
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
```

## Alerts

### GET /api/alerts/today

Returns alert rules triggered by the current weather and usage summary.

```bash
curl http://localhost:61209/api/alerts/today
```

Alert thresholds are configurable:

```env
ALERT_HOT_DAY_TEMP_C=38
ALERT_HIGH_GRID_UNITS=20
ALERT_HIGH_TOTAL_UNITS=25
ALERT_HIGH_DG_UNITS=1
```

## Home Assistant

### GET /api/status/home-assistant

Returns a flat response designed for Home Assistant REST sensors and template sensors.

```bash
curl http://localhost:61209/api/status/home-assistant
```

Example response:

```json
{
  "date": "2026-05-24",
  "location": "Ghaziabad",
  "currentTempC": 33.6,
  "maxTempC": 41,
  "minTempC": 31.8,
  "humidity": 18,
  "condition": "clear sky",
  "gridUnits": 1,
  "dgUnits": 0,
  "totalUnits": 1,
  "hasAlerts": true,
  "alertCount": 1,
  "highestSeverity": "warning",
  "analysisStatus": "hot-day",
  "isHotDay": true,
  "isHighUsage": false,
  "isDgUsed": false,
  "isCriticalAlert": false,
  "alertSummary": "Hot day detected"
}
```

Suggested Home Assistant REST sensor URL:

```text
http://<powercast-host>:61209/api/status/home-assistant
```

This endpoint intentionally avoids nested objects so Home Assistant templates stay simple.

## Scheduled Telegram summary

The scheduled daily Telegram summary uses the same summary generation flow as `/api/summary/today/send`.

Variables:

```env
DAILY_SUMMARY_ENABLED=true
DAILY_SUMMARY_CRON=0 21 * * *
DAILY_SUMMARY_TIMEZONE=Asia/Kolkata
```

Default schedule: daily at 9:00 PM IST.
