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
  "analysisStatus": "hot-day"
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
```

## Notes

- The endpoint is intentionally flat to keep Home Assistant templates simple.
- Suggested scan interval is 300 seconds because power and weather data do not need second-level refresh.
- MQTT publishing can be added later if Home Assistant REST polling is not enough.
