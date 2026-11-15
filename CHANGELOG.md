# Changelog

## 0.1.7

- Preserve one decimal place when calculated consumption is displayed in kilowatts.

## 0.1.6

- Round calculated consumption to zero decimal places.

## 0.1.5

- Match the solar node hierarchy and width to the battery node.
- Present solar power in the heading and daily yield on a full-width second row.
- Keep flow pulse segments a constant physical length while varying their spacing with power.

## 0.1.4

- Keep the load to the right of the power bus in portrait layouts.
- Add the optional `transparent` outer-card style.

## 0.1.3

- Default sections-dashboard cards to the full section width.
- Restore vertical grid resizing with a three-row minimum and compact rendering.

## 0.1.2

- Remove the redundant battery charging/discharging detail line.
- Support vertical resizing in Home Assistant sections dashboards, down to four grid rows.
- Place the battery below the bus and the load beside it in tall layouts.

## 0.1.1

- Move battery state of charge into the heading and right-align it.
- Expand the battery state-of-charge bar to the full content width.

## 0.1.0

- Add HACS metadata, validation, release automation, and installation instructions.
- Publish the repository-matching `hass-offgrid-power-card.js` distribution artifact.
- Add responsive solar, battery, power-bus, and calculated-load visualization.
- Add restrained directional flow pulses with reduced-motion support.
- Add Home Assistant sensor unit normalization, unavailable states, and scoped warnings.
- Add optional daily solar yield, battery time remaining, labels, icons, and title.
- Add manual installation documentation and a browser development fixture.
