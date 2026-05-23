# PowerCast

Weather-aware power consumption intelligence for Ghaziabad homes and society prepaid meters.

PowerCast connects local weather data, Grid/DG consumption data, and Telegram notifications to explain why electricity usage changes, detect unusual spikes, and eventually make recharge and billing deductions easier to understand.

> Phase 1 focuses only on weather plus power monitoring. Recharge amount and billing ledger calculations are intentionally kept for a later phase because society billing may include Grid charges, DG charges, fixed charges, maintenance deductions, and other adjustments.

## Why this project?

In Ghaziabad summers, high temperature usually means more AC usage. More AC usage means higher power consumption. Prepaid electricity apps often show deductions without clearly explaining the relationship between weather, Grid usage, DG usage, and society maintenance.

PowerCast aims to answer:

- Was today's power usage high because of heat?
- Did DG usage increase unexpectedly?
- Is today’s usage higher than the normal baseline?
- Should I expect higher consumption tomorrow because of weather?
- Can I get Telegram alerts before the bill or balance surprises me?

## Phase 1 scope

Phase 1 is a monitoring and explanation MVP.

### Included

- Fetch Ghaziabad weather data
- Fetch daily Grid/DG power consumption data
- Compare temperature vs consumption
- Send Telegram daily summaries
- Send basic abnormal usage alerts
- Prepare for Home Assistant or dashboard integration

### Not included yet

- Recharge ledger
- Balance prediction
- Society maintenance deduction calculation
- Fixed charge reconciliation
- Payment/recharge history automation
- Machine learning prediction

Those are future phases.

## High-level architecture

```text
Weather source
    |
    v
NestJS PowerCast API/Worker ---- Power consumption source
    |
    v
Analyzer / Rules Engine
    |
    +--> Telegram Alerts
    +--> In-memory or file-based cache for Phase 1
    +--> Dashboard / Home Assistant later
```

## Example Telegram summary

```text
PowerCast Daily Summary

Location: Ghaziabad
Max Temp: 41 C
Grid Usage: 14.8 units
DG Usage: 0.7 units

Observation:
High temperature day. AC usage likely increased.
```

## Suggested tech stack

- NestJS + TypeScript
- NestJS Schedule for cron jobs
- NestJS Config for environment variables
- NestJS HttpModule or fetch for API calls
- Telegram Bot API for alerts
- Docker Compose for self-hosting
- Optional Home Assistant integration later

## Database decision for Phase 1

Phase 1 does not require a full database at the start. The first version can fetch the current month data from the power API and weather provider, calculate the latest daily summary, and send Telegram alerts.

For short-term history or debugging, Phase 1 may use a small JSON file or lightweight local cache. A real database such as SQLite or PostgreSQL can be introduced in a later phase when trend analysis, dashboards, and billing ledger features need persistent history.

## Repository structure

```text
powerCast/
├── README.md
├── docs/
│   ├── architecture.md
│   ├── roadmap.md
│   ├── phase-1-weather-power-monitoring.md
│   ├── data-sources.md
│   ├── telegram-alerts.md
│   ├── home-assistant-integration.md
│   └── future-billing-ledger.md
├── .env.example
└── .gitignore
```

## Safety note

This is a public repository. Do not commit real API keys, Telegram bot tokens, society IDs, private endpoints, or personal recharge data. Use `.env` for secrets.

## Current status

Planning and architecture documentation started. Implementation will begin with Phase 1: NestJS Weather + Power Monitoring.
