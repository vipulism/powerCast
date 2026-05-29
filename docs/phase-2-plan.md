# Phase 2 Plan

Phase 2 will make PowerCast smarter and more useful beyond simple daily summaries.

## Goal

Move from static threshold-based alerts to context-aware insights using historical usage, weather patterns, Home Assistant integration, and future event-driven notifications.

## Architecture principles

PowerCast should remain an independent domain service.

This means:

- PowerCast owns weather, power usage, summary, alerts, and historical storage logic.
- PowerCast APIs should work even if Narada is unavailable.
- PowerCast should not directly call Narada for core flows.
- PowerCast can publish domain events to RabbitMQ.
- Narada can consume those RabbitMQ events and handle notifications or log distribution.

Future high-level flow:

```text
PowerCast
  ├─ REST API
  ├─ MariaDB historical storage
  ├─ Home Assistant endpoint
  ├─ Telegram command support
  └─ publishes events
        ↓
     RabbitMQ
        ↓
     Narada
        ↓
  Telegram / Email / Logs / Alerts
```

If RabbitMQ is down, PowerCast should continue serving APIs and saving data. Event publishing can be retried or logged for later handling.

## Recommended order

### 1. Home Assistant integration

Expose stable REST endpoints for Home Assistant sensors.

Current Home Assistant endpoint:

```text
GET /api/status/home-assistant
```

Suggested sensors:

- PowerCast current temperature
- PowerCast max temperature
- PowerCast Grid units today
- PowerCast DG units today
- PowerCast total units today
- PowerCast alert count
- PowerCast highest alert severity
- PowerCast alert summary

Why this is useful:

- Current API is already stable.
- Home Assistant can visualize data quickly.
- It avoids building a custom dashboard too early.

### 2. Swagger and API polish

Add richer Swagger documentation and response schemas.

Planned improvements:

- Controller-level Swagger tags
- Operation summaries
- Response DTO classes
- Error response documentation
- OpenAPI JSON verification

### 3. Historical storage

Use the already-installed MariaDB instance for PowerCast historical storage.

PowerCast should create and own its own schema/tables.

Recommended table names:

- `powercast_daily_usage_snapshots`
- `powercast_weather_snapshots`
- `powercast_alert_events`
- `powercast_notification_logs`

Initial fields for usage snapshots:

- `id`
- `snapshot_date`
- `consumer_id`
- `flat_number`
- `grid_units`
- `dg_units`
- `total_units`
- `source`
- `raw_payload`
- `created_at`
- `updated_at`

Initial fields for weather snapshots:

- `id`
- `snapshot_date`
- `location`
- `provider`
- `current_temp_c`
- `max_temp_c`
- `min_temp_c`
- `humidity`
- `condition`
- `raw_payload`
- `created_at`
- `updated_at`

Initial fields for alert events:

- `id`
- `event_date`
- `code`
- `severity`
- `title`
- `message`
- `source`
- `created_at`

### 4. Baseline-based alerts

Compare current usage with historical averages from MariaDB.

Example rules:

- Today Grid usage is 30% higher than the 7-day average.
- DG usage happened today but usually does not happen.
- Usage is high even though temperature is not high.
- Total usage is above the monthly daily average.

### 5. RabbitMQ event publishing

RabbitMQ will become shared messaging infrastructure for services.

PowerCast can publish domain events such as:

```text
powercast.summary.ready
powercast.alert.created
powercast.dg.used
powercast.high_usage.detected
powercast.snapshot.saved
```

Narada can consume these events and decide how to notify users.

Design rules:

- PowerCast should not directly depend on Narada.
- RabbitMQ publishing should be optional/configurable.
- Core PowerCast APIs should work without RabbitMQ.
- Failed event publish should be logged and later retried if needed.

### 6. Forecast and prediction

Use weather forecast and historical usage to predict expected power usage.

Example:

- Tomorrow max temperature expected 42 C.
- Expected AC usage may increase.
- Send early Telegram warning.

### 7. Recharge and billing ledger

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

## Suggested next PRs

### Swagger DTO schemas

```text
feat: add Swagger DTO schemas and API decorators
```

### Health metadata

```text
feat: add health metadata
```

Expected health response can include:

```json
{
  "status": "ok",
  "service": "powercast",
  "version": "0.1.0",
  "uptimeSeconds": 120,
  "environment": "production"
}
```

### MariaDB historical storage

```text
feat: add MariaDB historical snapshot storage
```

Start with saving daily weather and usage snapshots. Alerts and baseline logic can build on top of that.
