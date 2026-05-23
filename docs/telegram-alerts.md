# Telegram Alerts

Telegram is the first notification channel for PowerCast.

## Alert types

### Daily summary

Sent once per day.

```text
PowerCast Daily Summary
Location: Ghaziabad
Max Temp: 41 C
Grid Usage: 14.8 units
DG Usage: 0.7 units
Observation: Hot day. AC usage may be higher than usual.
```

### High usage alert

Sent when usage is higher than baseline.

```text
High Power Usage Alert
Today usage is higher than recent average.
Possible reason: high temperature and AC usage.
```

### DG usage alert

Sent when DG units are detected.

```text
DG Usage Alert
DG units detected today. Check if grid outage happened.
```

### Missing data alert

Sent when weather or power API fails.

```text
PowerCast Data Alert
Could not fetch weather or power data. Check API connectivity.
```

## Environment variables

```env
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
TELEGRAM_ENABLED=true
```

## Rules

- Do not commit Telegram bot tokens.
- Keep messages short and actionable.
- Avoid sending too many alerts in Phase 1.
