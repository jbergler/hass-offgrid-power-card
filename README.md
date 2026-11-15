# Off-grid Power Card

A responsive Home Assistant dashboard card for a solar source, one battery, and calculated electrical consumption. It presents current power flow, battery state of charge, optional remaining time, and optional daily solar yield without querying history.

## Install

1. Run `npm install && npm run build`.
2. Copy `dist/offgrid-power-card.js` to Home Assistant's `config/www/` directory.
3. Add `/local/offgrid-power-card.js` as a JavaScript module under **Settings → Dashboards → Resources**.
4. Add the card with YAML configuration.

This initial release is manually installed and YAML-only; it does not include HACS metadata or a visual editor.

## Configuration

```yaml
type: custom:offgrid-power-card
title: RV power
solar_power_entity: sensor.rv_solar_power
solar_energy_today_entity: sensor.rv_solar_energy_today
battery_soc_entity: sensor.rv_battery_state_of_charge
battery_power_entity: sensor.rv_battery_power
battery_time_remaining_entity: sensor.rv_battery_time_remaining
battery_power_positive: discharging
flow_rate_threshold: 5
max_power: 3000
```

| Key | Required | Default | Meaning |
|---|---:|---|---|
| `solar_power_entity` | Yes | — | Current solar production; power sensor using mW, W, kW, or MW |
| `battery_soc_entity` | Yes | — | Battery state of charge in percent |
| `battery_power_entity` | Yes | — | Signed battery power; power sensor using mW, W, kW, or MW |
| `solar_energy_today_entity` | No | Hidden | Today's solar yield; energy sensor using mWh, Wh, kWh, or MWh |
| `battery_time_remaining_entity` | No | Hidden | Remaining time; duration sensor using ms, s, min, h, or d |
| `battery_power_positive` | No | `discharging` | Meaning of a positive battery-power value: `discharging` or `charging` |
| `flow_rate_threshold` | No | `5` | Absolute power in watts below which animation stops |
| `max_power` | No | `3000` | Power in watts represented by maximum pulse density |
| `title` | No | Hidden | Optional card heading |
| `solar_label`, `battery_label`, `load_label` | No | Solar, Battery, Load | Node labels |
| `solar_icon`, `battery_icon`, `load_icon` | No | Matching MDI icons | Node icon overrides |

When a compatible `device_class` is present, the card validates it. Template sensors without a device class remain supported when their units are compatible.

## Electrical model

With the default positive-discharge convention:

```text
calculated load = solar power + battery power
```

Battery charging is represented by negative battery power. If `battery_power_positive: charging` is selected, the card normalizes that sign before calculating load.

Solar and battery feed a central power bus; the battery connection reverses direction while charging. Negative solar or calculated load values remain visible but stop the affected animation and receive a warning indicator. Unknown, unavailable, malformed, or dimensionally incompatible values appear as `—` only where affected.

## Display behavior

- Wide containers place solar, bus, and load horizontally with the battery below the bus.
- Tall containers place solar and load vertically, with the battery beside the bus.
- Power uses W below 1,000 W and kW at or above 1,000 W.
- Pulses move slowly; density represents power relative to `max_power`.
- Static arrowheads preserve direction when reduced-motion preferences disable animation.
- Optional details are progressively hidden in very narrow containers.
- The card inherits Home Assistant colors, typography, card shape, and dark/light theme variables.

## Development

```sh
npm install
npm test
npm run typecheck
npm run dev
npm run build
```

The development page renders both wide and tall fixtures with mocked Home Assistant state.
