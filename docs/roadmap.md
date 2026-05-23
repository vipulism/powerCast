# Roadmap

PowerCast will be built in phases so the core monitoring remains simple and stable before billing calculations are added.

## Phase 1: Weather and Power Monitoring

Goal: explain power usage using weather context.

Deliverables:

- Weather data collection for Ghaziabad
- Daily Grid and DG consumption collection
- Daily summary generation
- Telegram notifications
- Basic high usage detection
- No full database required initially

## Phase 1.5: On-Demand Updates

Goal: allow the user to request the latest PowerCast summary whenever needed, instead of waiting for the scheduled daily summary.

This should come after Phase 1 because it reuses the same weather client, power client, analyzer and Telegram formatter. It should come before dashboard work because it gives immediate value without building UI.

Deliverables:

- Manual trigger endpoint in NestJS
- Optional Telegram command support later
- On-demand latest summary
- On-demand Grid/DG usage check
- On-demand weather and power comparison
- Basic protection so only allowed users/systems can trigger it

Example use cases:

- Someone wants current usage info immediately
- User wants to check if today is already high usage
- User wants a quick weather plus power explanation
- User wants to test Telegram summary without waiting for cron

Possible commands or endpoints:

```text
GET /summary/today
POST /jobs/daily-summary/run
Telegram: /summary
Telegram: /power
Telegram: /weather
```

## Phase 2: Alerts

Goal: notify when consumption looks unusual.

Deliverables:

- High Grid usage alerts
- DG usage alerts
- Heatwave and expected high consumption alerts
- Missing API data alerts
- Telegram alert formatting

## Phase 3: Dashboard

Goal: show usage and weather trends visually.

Deliverables:

- Today summary cards
- Monthly Grid and DG chart
- Temperature vs usage chart
- Home Assistant cards or a small web dashboard

## Phase 4: Prediction

Goal: estimate expected consumption based on recent weather and history.

Deliverables:

- Baseline usage calculation
- Temperature based usage estimate
- Simple forecast summary
- Later model experiments if useful

## Phase 5: Recharge and Billing Ledger

Goal: track recharge, charges, deductions, maintenance and balance.

This is intentionally the last phase because it depends on understanding:

- Grid unit rate
- DG unit rate
- Fixed charges
- Society maintenance deductions
- App deductions
- Recharge history

Deliverables:

- Manual recharge entries
- Monthly ledger
- Estimated balance
- Charge breakdown
- Telegram recharge command later
