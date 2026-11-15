import { describe, expect, it } from "vitest";
import {
  derivePowerSystem,
  normalizeConfig,
  type HomeAssistantState,
  type OffgridPowerCardConfig,
} from "../src/power-system";

const config: OffgridPowerCardConfig = {
  type: "custom:offgrid-power-card",
  solar_power_entity: "sensor.solar_power",
  battery: {
    soc: "sensor.battery_soc",
    power: "sensor.battery_power",
  },
};

function states(
  values: Record<string, [state: string, unit: string, deviceClass?: string]>,
): Record<string, HomeAssistantState> {
  return Object.fromEntries(
    Object.entries(values).map(([entityId, [state, unit, deviceClass]]) => [
      entityId,
      {
        state,
        attributes: {
          unit_of_measurement: unit,
          ...(deviceClass ? { device_class: deviceClass } : {}),
        },
      },
    ]),
  );
}

describe("derivePowerSystem", () => {
  it("calculates load and flow direction when the battery is discharging", () => {
    const system = derivePowerSystem(
      config,
      states({
        "sensor.solar_power": ["400", "W", "power"],
        "sensor.battery_soc": ["72", "%", "battery"],
        "sensor.battery_power": ["100", "W", "power"],
      }),
    );

    expect(system.solar.watts).toBe(400);
    expect(system.battery.watts).toBe(100);
    expect(system.battery.mode).toBe("discharging");
    expect(system.load.watts).toBe(500);
    expect(system.flows.solar.direction).toBe("to-bus");
    expect(system.flows.battery.direction).toBe("to-bus");
    expect(system.flows.load.direction).toBe("from-bus");
  });

  it("normalizes compatible Home Assistant power units before calculating load", () => {
    const system = derivePowerSystem(
      config,
      states({
        "sensor.solar_power": ["1.2", "kW"],
        "sensor.battery_soc": ["64", "%"],
        "sensor.battery_power": ["250000", "mW"],
      }),
    );

    expect(system.solar.watts).toBe(1200);
    expect(system.battery.watts).toBe(250);
    expect(system.load.watts).toBe(1450);
  });

  it("normalizes configured daily energy and remaining duration telemetry", () => {
    const system = derivePowerSystem(
      {
        ...config,
        solar_energy_today_entity: "sensor.solar_energy_today",
        battery: {
          ...config.battery,
          time_remaining: "sensor.battery_time_remaining",
        },
      },
      states({
        "sensor.solar_power": ["600", "W", "power"],
        "sensor.solar_energy_today": ["1.75", "kWh", "energy"],
        "sensor.battery_soc": ["54", "%", "battery"],
        "sensor.battery_power": ["-200", "W", "power"],
        "sensor.battery_time_remaining": ["2.5", "h", "duration"],
      }),
    );

    expect(system.solar.energyTodayWh).toBe(1750);
    expect(system.battery.timeRemainingSeconds).toBe(9000);
    expect(system.battery.mode).toBe("charging");
    expect(system.load.watts).toBe(400);
    expect(system.flows.battery.direction).toBe("from-bus");
  });

  it("applies safe defaults and rejects a missing required entity", () => {
    const normalized = normalizeConfig(config);

    expect(normalized.battery.power_positive).toBe("discharging");
    expect(normalized.flow_rate_threshold).toBe(5);
    expect(normalized.max_power).toBe(3000);
    expect(() =>
      normalizeConfig({
        type: "custom:offgrid-power-card",
        solar_power_entity: "sensor.solar_power",
        battery: {
          power: "sensor.battery_power",
        },
      }),
    ).toThrow("battery.soc");
  });

  it("rejects an entity whose declared device class has the wrong dimension", () => {
    const system = derivePowerSystem(
      config,
      states({
        "sensor.solar_power": ["13.4", "W", "voltage"],
        "sensor.battery_soc": ["80", "%", "battery"],
        "sensor.battery_power": ["100", "W", "power"],
      }),
    );

    expect(system.solar.watts).toBeNull();
    expect(system.load.watts).toBeNull();
    expect(system.flows.solar.direction).toBe("stopped");
  });
});
