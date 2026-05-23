# GitHub Secrets and Variables

PowerCast will be deployed to the homelab using GitHub Actions.

Use this document as the source of truth for values that need to be created in GitHub.

GitHub path:

```text
Repository -> Settings -> Secrets and variables -> Actions
```

## Secrets

Secrets are sensitive values. Do not commit them to the repository.

Create these under:

```text
Settings -> Secrets and variables -> Actions -> Secrets
```

| Name | Required | Where to get it | Notes |
|---|---:|---|---|
| `TELEGRAM_BOT_TOKEN` | Yes | Telegram `@BotFather` | Create a bot and copy the bot token. |
| `TELEGRAM_CHAT_ID` | Yes | Telegram Bot API `getUpdates` | Send a message to the bot, then read `chat.id`. |

## Variables

Variables are non-secret deployment/config values.

Create these under:

```text
Settings -> Secrets and variables -> Actions -> Variables
```

| Name | Required | Example | Notes |
|---|---:|---|---|
| `NODE_ENV` | Yes | `production` | Runtime mode. |
| `WEATHER_PROVIDER` | Yes | `open-meteo` | Phase 1 starts with Open-Meteo. |
| `LOCATION_NAME` | Yes | `Ghaziabad` | Human-readable location name. |
| `LOCATION_LAT` | Yes | empty for now | Set Ghaziabad latitude during implementation. |
| `LOCATION_LON` | Yes | empty for now | Set Ghaziabad longitude during implementation. |
| `POWER_API_BASE_URL` | Yes | `https://mp.adwards.in` | Base URL for power API. |
| `POWER_API_MONTHLY_CHART_PATH` | Yes | `/Prepaid_data_daily_log_gridHelper/get_daily_chart_data` | Monthly Grid/DG chart endpoint path. |
| `POWER_API_CONSUMER_ID` | Yes | `500152051201` | Existing consumer ID. |
| `POWER_API_FLAT_NUMBER` | Yes | `1201` | Last four digits of consumer ID represent flat number. |
| `DEPLOY_PATH` | Yes | `/opt/stacks/powercast` | Homelab deployment path. |
| `APP_PORT` | Yes | `61209` | Local app port for future REST API. |

## Current known power endpoint

Working example:

```text
https://mp.adwards.in/Prepaid_data_daily_log_gridHelper/get_daily_chart_data/500152051201/2026-05
```

Endpoint format:

```text
{POWER_API_BASE_URL}{POWER_API_MONTHLY_CHART_PATH}/{POWER_API_CONSUMER_ID}/{YYYY-MM}
```

## Flat number rule

Current consumer ID:

```text
500152051201
```

Flat number:

```text
1201
```

Keep both values configurable:

```env
POWER_API_CONSUMER_ID=500152051201
POWER_API_FLAT_NUMBER=1201
```

## Values not needed in Phase 1

Because Phase 1 starts with Open-Meteo, no weather API key is required initially.

Optional future secret:

```text
WEATHER_API_KEY
```

Only add it if a paid or key-based weather provider is introduced later.
