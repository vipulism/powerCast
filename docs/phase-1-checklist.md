# Phase 1 Checklist

This checklist tracks the current PowerCast Phase 1 status and what remains before moving into Phase 1.5 or Phase 2.

## Completed

- [x] NestJS app skeleton
- [x] Dockerfile
- [x] Docker Compose deployment
- [x] GitHub Actions self-hosted runner deployment
- [x] Auto deploy on push to `dev`
- [x] Open-Meteo weather integration
- [x] Power monthly chart API integration
- [x] Usage date normalization
- [x] Summary endpoint
- [x] Telegram on-demand summary
- [x] Scheduled daily Telegram summary
- [x] Alerts endpoint
- [x] Alerts included in summary response
- [x] Alerts included in Telegram summary
- [x] Configurable alert thresholds
- [x] Basic request validation for monthly usage
- [x] Basic service logging
- [x] API documentation

## Current endpoints

```text
GET  /api/health
GET  /api/weather/today
GET  /api/usage/today
GET  /api/usage/monthly?month=YYYY-MM
GET  /api/summary/today
POST /api/summary/today/send
GET  /api/alerts/today
```

## Current runtime flow

```text
GitHub PR -> dev merge -> GitHub Actions -> self-hosted runner -> Docker Compose -> PowerCast container
```

Application flow:

```text
WeatherModule + UsageModule
          |
          v
SummaryModule
          |
          +--> AnalyzerModule
          +--> AlertsModule
          +--> Telegram message formatter
```

## Required GitHub Secrets

```text
TELEGRAM_BOT_TOKEN
TELEGRAM_CHAT_ID
```

## Required GitHub Variables

```text
NODE_ENV
WEATHER_PROVIDER
LOCATION_NAME
LOCATION_LAT
LOCATION_LON
POWER_API_BASE_URL
POWER_API_MONTHLY_CHART_PATH
POWER_API_CONSUMER_ID
POWER_API_FLAT_NUMBER
DEPLOY_PATH
APP_PORT
DAILY_SUMMARY_ENABLED
DAILY_SUMMARY_CRON
DAILY_SUMMARY_TIMEZONE
ALERT_HOT_DAY_TEMP_C
ALERT_HIGH_GRID_UNITS
ALERT_HIGH_TOTAL_UNITS
ALERT_HIGH_DG_UNITS
```

## Standard verification commands

```bash
curl http://localhost:61209/api/health
curl http://localhost:61209/api/weather/today
curl http://localhost:61209/api/usage/today
curl "http://localhost:61209/api/usage/monthly?month=2026-05"
curl http://localhost:61209/api/summary/today
curl -X POST http://localhost:61209/api/summary/today/send
curl http://localhost:61209/api/alerts/today
```

## Known limitations

- No database in Phase 1.
- No historical trend analysis yet.
- Alert thresholds are static configuration values, not baseline-based.
- Telegram bot currently sends messages only through scheduled or on-demand API flow.
- No Telegram command listener yet.
- No UI dashboard yet.
- No recharge ledger yet.
- No society maintenance or fixed charge calculation yet.

## Suggested next phases

### Phase 1.5: On-demand controls

- Telegram commands:
  - `/summary`
  - `/weather`
  - `/usage`
  - `/alerts`
  - `/help`
- Optional protected manual job endpoint.
- Better Telegram message formatting.

### Phase 2: Smarter alerts

- Baseline-based usage comparison.
- Weather forecast based early warning.
- Separate alert notification rules.
- Alert cooldown / duplicate prevention.

### Phase 3: Dashboard and Home Assistant

- Dashboard summary cards.
- Home Assistant REST sensors.
- Optional MQTT publishing.
- Monthly charts.

### Phase 4: Prediction

- Expected usage estimate based on temperature.
- AC usage correlation.
- Monthly forecast.

### Phase 5: Recharge and billing ledger

- Manual recharge entries.
- Grid/DG charge split.
- Fixed charge tracking.
- Maintenance deduction tracking.
- Estimated balance.
