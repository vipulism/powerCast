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
- Local storage for historical comparison

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
