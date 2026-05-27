# Phase 2 Plan

Phase 2 will make PowerCast smarter and more useful beyond simple daily summaries.

## Goal

Move from static threshold-based alerts to context-aware insights using historical usage, weather patterns, and optional Home Assistant integration.

## Recommended order

### 1. Home Assistant integration

Expose stable REST endpoints for Home Assistant sensors.

Suggested sensors:

- PowerCast current temperature
- PowerCast max temperature
- PowerCast Grid units today
- PowerCast DG units today
- PowerCast total units today
- PowerCast alert count
- PowerCast highest alert severity

Why this is next:

- Current API is already stable.
- Home Assistant can visualize data quickly.
- It avoids building a custom dashboard too early.

### 2. MQTT publishing

Publish summary, usage, weather, and alerts to MQTT for Home Assistant or other automations.

Suggested topics:

```text
powercast/weather/today
powercast/usage/today
powercast/summary/today
powercast/alerts/today
```

### 3. Historical storage

Add a lightweight database or file-based storage to keep daily snapshots.

Recommended initial storage:

- SQLite for local homelab deployment
- Prisma for schema and migrations

Initial tables:

- daily_weather_snapshots
- daily_usage_snapshots
- daily_alerts
- notification_logs

### 4. Baseline-based alerts

Compare current usage with historical averages.

Example rules:

- Today Grid usage is 30% higher than 7-day average.
- DG usage happened today but usually does not happen.
- Usage is high even though temperature is not high.

### 5. Forecast and prediction

Use weather forecast to predict expected power usage.

Example:

- Tomorrow max temperature expected 42 C.
- Expected AC usage may increase.
- Send early Telegram warning.

### 6. Recharge and billing ledger

Keep recharge records and calculate approximate deductions.

This should remain later because billing and maintenance deduction logic needs careful observation.

Future fields:

- recharge amount
- recharge date
- balance after recharge
- Grid rate
- DG rate
- fixed charge
- maintenance deduction
- notes

## Suggested next PR

Start with Home Assistant friendly API response improvements.

PR title:

```text
feat: add Home Assistant friendly status endpoint
```

Endpoint:

```text
GET /api/status/home-assistant
```

Example response:

```json
{
  "date": "2026-05-24",
  "location": "Ghaziabad",
  "currentTempC": 33.6,
  "maxTempC": 41,
  "gridUnits": 1,
  "dgUnits": 0,
  "totalUnits": 1,
  "hasAlerts": true,
  "alertCount": 1,
  "highestSeverity": "warning"
}
```

This keeps Home Assistant templates simple and gives us a clean bridge before MQTT or dashboard work.
