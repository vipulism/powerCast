# Home Assistant Integration

PowerCast exposes a flat endpoint designed for Home Assistant REST sensors.

## Endpoint

```text
GET /api/status/home-assistant
```

Homelab URL:

```text
http://<powercast-host>:61209/api/status/home-assistant
```

Example local test:

```bash
curl http://localhost:61209/api/status/home-assistant
```

## Example response

```json
{
  "date": "2026-05-24",
  "location": "Ghaziabad",
  "currentTempC": 33.6,
  "maxTempC": 41,
  "minTempC": 31.8,
  "humidity": 18,
  "condition": "clear sky",
  "gridUnits": 1,
  "dgUnits": 0,
  "totalUnits": 1,
  "hasAlerts": true,
  "alertCount": 1,
  "highestSeverity": "warning",
  "analysisStatus": "hot-day",
  "isHotDay": true,
  "isHighUsage": false,
  "isDgUsed": false,
  "isCriticalAlert": false,
  "alertSummary": "Hot day detected"
}
```

## Suggested Home Assistant REST sensor

Add this to Home Assistant configuration after replacing the host/IP.

```yaml
sensor:
  - platform: rest
    name: PowerCast Status
    resource: http://<powercast-host>:61209/api/status/home-assistant
    method: GET
    scan_interval: 300
    value_template: "{{ value_json.analysisStatus }}"
    json_attributes:
      - date
      - location
      - currentTempC
      - maxTempC
      - minTempC
      - humidity
      - condition
      - gridUnits
      - dgUnits
      - totalUnits
      - hasAlerts
      - alertCount
      - highestSeverity
      - analysisStatus
      - isHotDay
      - isHighUsage
      - isDgUsed
      - isCriticalAlert
      - alertSummary
```

## Suggested template sensors

```yaml
template:
  - sensor:
      - name: PowerCast Current Temperature
        unit_of_measurement: "°C"
        state: "{{ state_attr('sensor.powercast_status', 'currentTempC') }}"

      - name: PowerCast Max Temperature
        unit_of_measurement: "°C"
        state: "{{ state_attr('sensor.powercast_status', 'maxTempC') }}"

      - name: PowerCast Grid Units Today
        unit_of_measurement: "units"
        state: "{{ state_attr('sensor.powercast_status', 'gridUnits') }}"

      - name: PowerCast DG Units Today
        unit_of_measurement: "units"
        state: "{{ state_attr('sensor.powercast_status', 'dgUnits') }}"

      - name: PowerCast Total Units Today
        unit_of_measurement: "units"
        state: "{{ state_attr('sensor.powercast_status', 'totalUnits') }}"

      - name: PowerCast Alert Count
        state: "{{ state_attr('sensor.powercast_status', 'alertCount') }}"

      - name: PowerCast Highest Severity
        state: "{{ state_attr('sensor.powercast_status', 'highestSeverity') }}"

      - name: PowerCast Alert Summary
        state: "{{ state_attr('sensor.powercast_status', 'alertSummary') }}"
```

## Dashboard card examples

### Entities card

```yaml
type: entities
title: PowerCast
entities:
  - entity: sensor.powercast_current_temperature
    name: Current Temp
  - entity: sensor.powercast_max_temperature
    name: Max Temp
  - entity: sensor.powercast_humidity
    name: Humidity
  - entity: sensor.powercast_grid_units_today
    name: Grid Units Today
  - entity: sensor.powercast_dg_units_today
    name: DG Units Today
  - entity: sensor.powercast_total_units_today
    name: Total Units Today
  - entity: sensor.powercast_alert_count
    name: Alert Count
  - entity: sensor.powercast_highest_severity
    name: Highest Severity
  - entity: sensor.powercast_analysis_status
    name: Analysis Status
```

### Glance card

```yaml
type: glance
title: PowerCast
entities:
  - entity: sensor.powercast_current_temperature
    name: Current
  - entity: sensor.powercast_max_temperature
    name: Max
  - entity: sensor.powercast_grid_units_today
    name: Grid
  - entity: sensor.powercast_dg_units_today
    name: DG
  - entity: sensor.powercast_total_units_today
    name: Total
  - entity: sensor.powercast_alert_count
    name: Alerts
```

## Automation examples

### Notify when critical alert is active

```yaml
automation:
  - alias: PowerCast Critical Alert
    trigger:
      - platform: state
        entity_id: sensor.powercast_highest_severity
        to: "critical"
    action:
      - service: persistent_notification.create
        data:
          title: PowerCast Critical Alert
          message: "{{ state_attr('sensor.powercast_status', 'alertSummary') }}"
```

### Notify when DG is used

This uses the raw PowerCast status attributes.

```yaml
automation:
  - alias: PowerCast DG Usage Detected
    trigger:
      - platform: template
        value_template: "{{ state_attr('sensor.powercast_status', 'isDgUsed') == true }}"
    action:
      - service: persistent_notification.create
        data:
          title: PowerCast DG Usage Detected
          message: "DG usage today: {{ state_attr('sensor.powercast_status', 'dgUnits') }} units"
```

## Notes

- The endpoint is intentionally flat to keep Home Assistant templates simple.
- Suggested scan interval is 300 seconds because power and weather data do not need second-level refresh.
- MQTT publishing can be added later if Home Assistant REST polling is not enough.
