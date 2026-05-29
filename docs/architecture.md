# PowerCast Architecture

PowerCast is the domain service for weather-aware power consumption monitoring.

## Core responsibility

PowerCast owns:

- Weather data integration
- Power usage integration
- Summary generation
- Alert rules
- Historical storage
- Home Assistant status endpoint
- Telegram command responses for PowerCast-specific queries

## Current Phase 1 flow

```text
Open-Meteo Weather API
        |
        v
WeatherModule
        |
        +--------------------------+
                                   |
Power Monthly Chart API            |
        |                          |
        v                          v
UsageModule ----------------> SummaryModule
                                   |
                                   v
                             AnalyzerModule
                                   |
                    +--------------+--------------+
                    |                             |
                    v                             v
              Telegram Summary              AlertsModule
                    |                             |
                    v                             v
       Scheduled / On-demand message       GET /api/alerts/today
```

## Independence rule

PowerCast should remain independently deployable and independently functional.

This means:

- PowerCast should not directly depend on Narada for core behavior.
- PowerCast REST APIs should continue working if Narada is unavailable.
- PowerCast historical storage should continue working if Narada is unavailable.
- Future RabbitMQ event publishing should not break the core user-facing APIs.

## Future service communication

RabbitMQ can be introduced as shared messaging infrastructure.

PowerCast can publish domain events. Other services can consume those events.

```text
PowerCast
  ├─ stores data in MariaDB
  ├─ exposes REST APIs
  ├─ exposes Home Assistant endpoint
  └─ publishes domain events
        ↓
     RabbitMQ
        ↓
     Narada
        ↓
  Telegram / Email / Logs / Alerts
```

## Narada relationship

Narada should be treated as a notification and event consumer, not as a hard dependency for PowerCast.

Narada can later handle:

- Telegram notifications
- Email notifications
- Alert fanout
- Log/event distribution
- Cross-service notification rules

PowerCast can still keep direct Telegram command support if it remains useful for PowerCast-specific queries.

## Example future events

```text
powercast.summary.ready
powercast.alert.created
powercast.dg.used
powercast.high_usage.detected
powercast.snapshot.saved
```

## Failure behavior

If RabbitMQ is down:

- PowerCast API should still work.
- PowerCast DB snapshot storage should still work.
- PowerCast should log event publishing failure.
- A retry/outbox mechanism can be added later.
- Narada notifications may be delayed until events are republished.

## Historical storage

PowerCast will use the existing MariaDB instance for historical storage.

PowerCast should own its own tables, prefixed with `powercast_`, for example:

- `powercast_daily_usage_snapshots`
- `powercast_weather_snapshots`
- `powercast_alert_events`
- `powercast_notification_logs`

MariaDB becomes the source for:

- Daily usage history
- Weather history
- Alert history
- Baseline-based alert calculations
- Trend and dashboard data

## Deployment target

- Self-hosted Docker setup
- Runs on the existing homelab server
- Integrates with Home Assistant through REST sensors
- Future services can integrate through RabbitMQ events
