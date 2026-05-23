# Home Assistant Integration

Home Assistant integration is planned after the initial monitoring worker is stable.

## Goal

Expose PowerCast data to Home Assistant so the dashboard can show weather-aware power consumption.

## Possible entities

- sensor.powercast_grid_units_today
- sensor.powercast_dg_units_today
- sensor.powercast_total_units_today
- sensor.powercast_max_temperature_today
- sensor.powercast_usage_status
- sensor.powercast_daily_summary

## Possible cards

- Today weather card
- Grid vs DG card
- Temperature vs usage chart
- Monthly usage chart
- Alert summary card

## Integration options

### Option 1: REST sensors

PowerCast exposes a local REST API and Home Assistant reads sensors from it.

### Option 2: MQTT sensors

PowerCast publishes daily data to MQTT topics and Home Assistant consumes them.

Example topics:

```text
powercast/today/grid_units
powercast/today/dg_units
powercast/today/max_temp_c
powercast/status
```

## Preferred Phase 1 approach

Keep Home Assistant integration optional. First build the data collector, analyzer and Telegram alerts. Add REST or MQTT after the data model becomes stable.
