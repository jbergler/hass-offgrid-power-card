import "./offgrid-power-card";
import type { HomeAssistant } from "./offgrid-power-card";

class DemoIcon extends HTMLElement {
  static get observedAttributes(): string[] {
    return ["icon"];
  }

  connectedCallback(): void {
    this.renderIcon();
  }

  attributeChangedCallback(): void {
    this.renderIcon();
  }

  private renderIcon(): void {
    const icon = this.getAttribute("icon") ?? "";
    const drawing = icon.includes("sunny")
      ? '<circle cx="12" cy="12" r="4"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3M5 5l2 2m10 10 2 2M19 5l-2 2M7 17l-2 2"/>'
      : icon.includes("battery")
        ? '<rect x="4" y="7" width="15" height="10" rx="2"/><path d="M21 10v4M7 10v4m3-4v4m3-4v4m3-4v4"/>'
        : '<path d="M3 11l9-7 9 7v9h-7v-6h-4v6H3z"/>';
    this.innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${drawing}</svg>`;
  }
}

class DemoCard extends HTMLElement {}
customElements.define("ha-icon", DemoIcon);
customElements.define("ha-card", DemoCard);


const hass: HomeAssistant = {
  locale: { language: "en-US" },
  states: {
    "sensor.solar_power": {
      state: "850",
      attributes: { unit_of_measurement: "W", device_class: "power" },
    },
    "sensor.solar_energy_today": {
      state: "2.4",
      attributes: { unit_of_measurement: "kWh", device_class: "energy" },
    },
    "sensor.battery_soc": {
      state: "68",
      attributes: { unit_of_measurement: "%", device_class: "battery" },
    },
    "sensor.battery_power": {
      state: "-220",
      attributes: { unit_of_measurement: "W", device_class: "power" },
    },
    "sensor.battery_time_remaining": {
      state: "3.2",
      attributes: { unit_of_measurement: "h", device_class: "duration" },
    },
  },
};

for (const card of document.querySelectorAll("offgrid-power-card")) {
  card.setConfig({
    type: "custom:offgrid-power-card",
    title: "RV power",
    solar_power_entity: "sensor.solar_power",
    solar_energy_today_entity: "sensor.solar_energy_today",
    battery: {
      soc: "sensor.battery_soc",
      power: "sensor.battery_power",
      time_remaining: "sensor.battery_time_remaining",
    },
  });
  card.hass = hass;
}
