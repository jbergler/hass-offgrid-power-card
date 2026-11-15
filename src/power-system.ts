export type BatteryPowerPositive = "discharging" | "charging";

export interface OffgridPowerCardConfig {
  type: "custom:offgrid-power-card";
  title?: string;
  solar_power_entity: string;
  battery_soc_entity: string;
  battery_power_entity: string;
  solar_energy_today_entity?: string;
  battery_time_remaining_entity?: string;
  battery_power_positive?: BatteryPowerPositive;
  flow_rate_threshold?: number;
  max_power?: number;
  solar_label?: string;
  battery_label?: string;
  load_label?: string;
  solar_icon?: string;
  battery_icon?: string;
  load_icon?: string;
}

export interface NormalizedOffgridPowerCardConfig
  extends OffgridPowerCardConfig {
  battery_power_positive: BatteryPowerPositive;
  flow_rate_threshold: number;
  max_power: number;
}

export function normalizeConfig(
  input: unknown,
): NormalizedOffgridPowerCardConfig {
  if (typeof input !== "object" || input === null) {
    throw new Error("Card configuration must be an object");
  }

  const config = input as Record<string, unknown>;
  const requiredEntities = [
    "solar_power_entity",
    "battery_soc_entity",
    "battery_power_entity",
  ] as const;
  for (const key of requiredEntities) {
    if (typeof config[key] !== "string" || config[key].trim() === "") {
      throw new Error(`${key} must be a non-empty entity ID`);
    }
  }

  const positive = config.battery_power_positive ?? "discharging";
  if (positive !== "discharging" && positive !== "charging") {
    throw new Error(
      "battery_power_positive must be 'discharging' or 'charging'",
    );
  }

  const threshold = config.flow_rate_threshold ?? 5;
  if (typeof threshold !== "number" || !Number.isFinite(threshold) || threshold < 0) {
    throw new Error("flow_rate_threshold must be a non-negative number");
  }

  const maxPower = config.max_power ?? 3000;
  if (typeof maxPower !== "number" || !Number.isFinite(maxPower) || maxPower <= 0) {
    throw new Error("max_power must be a positive number");
  }

  return {
    ...(config as unknown as OffgridPowerCardConfig),
    battery_power_positive: positive,
    flow_rate_threshold: threshold,
    max_power: maxPower,
  };
}

export interface HomeAssistantState {
  state: string;
  attributes: {
    unit_of_measurement?: string;
    device_class?: string;
    friendly_name?: string;
    [key: string]: unknown;
  };
}

export type FlowDirection = "to-bus" | "from-bus" | "stopped";

export interface PowerFlow {
  direction: FlowDirection;
  intensity: number;
}

export interface PowerSystem {
  solar: {
    watts: number | null;
    energyTodayWh: number | null;
    warning: boolean;
  };
  battery: {
    soc: number | null;
    watts: number | null;
    timeRemainingSeconds: number | null;
    mode: "charging" | "discharging" | "idle" | "unavailable";
    warning: boolean;
  };
  load: {
    watts: number | null;
    warning: boolean;
  };
  flows: {
    solar: PowerFlow;
    battery: PowerFlow;
    load: PowerFlow;
  };
}

function numericState(state: HomeAssistantState | undefined): number | null {
  if (!state || state.state === "unknown" || state.state === "unavailable") {
    return null;
  }

  const value = Number(state.state);
  return Number.isFinite(value) ? value : null;
}

function powerState(state: HomeAssistantState | undefined): number | null {
  if (
    state?.attributes.device_class !== undefined &&
    state.attributes.device_class !== "power"
  ) {
    return null;
  }

  const value = numericState(state);
  if (value === null) {
    return null;
  }

  const factors: Record<string, number> = {
    mW: 0.001,
    W: 1,
    kW: 1000,
    MW: 1_000_000,
  };
  const unit = state?.attributes.unit_of_measurement;
  const factor = unit === undefined ? undefined : factors[unit];
  return factor === undefined ? null : value * factor;
}

function energyState(state: HomeAssistantState | undefined): number | null {
  if (
    state?.attributes.device_class !== undefined &&
    state.attributes.device_class !== "energy"
  ) {
    return null;
  }

  const value = numericState(state);
  const factors: Record<string, number> = {
    mWh: 0.001,
    Wh: 1,
    kWh: 1000,
    MWh: 1_000_000,
  };
  const unit = state?.attributes.unit_of_measurement;
  const factor = unit === undefined ? undefined : factors[unit];
  return value === null || factor === undefined ? null : value * factor;
}

function durationState(state: HomeAssistantState | undefined): number | null {
  if (
    state?.attributes.device_class !== undefined &&
    state.attributes.device_class !== "duration"
  ) {
    return null;
  }
  const value = numericState(state);
  const factors: Record<string, number> = {
    ms: 0.001,
    s: 1,
    min: 60,
    h: 3600,
    d: 86_400,
  };
  const unit = state?.attributes.unit_of_measurement;
  const factor = unit === undefined ? undefined : factors[unit];
  return value === null || factor === undefined ? null : value * factor;
}

function flow(
  watts: number | null,
  direction: Exclude<FlowDirection, "stopped">,
  threshold: number,
  maxPower: number,
): PowerFlow {
  if (watts === null || watts < threshold) {
    return { direction: "stopped", intensity: 0 };
  }

  return {
    direction,
    intensity: Math.min(watts / maxPower, 1),
  };
}

export function derivePowerSystem(
  config: OffgridPowerCardConfig,
  states: Record<string, HomeAssistantState>,
): PowerSystem {
  const threshold = config.flow_rate_threshold ?? 5;
  const maxPower = config.max_power ?? 3000;
  const solarWatts = powerState(states[config.solar_power_entity]);
  const batteryRawWatts = powerState(states[config.battery_power_entity]);
  const energyTodayWh = config.solar_energy_today_entity
    ? energyState(states[config.solar_energy_today_entity])
    : null;
  const timeRemainingSeconds = config.battery_time_remaining_entity
    ? durationState(states[config.battery_time_remaining_entity])
    : null;
  const batteryWatts =
    batteryRawWatts === null
      ? null
      : batteryRawWatts *
        (config.battery_power_positive === "charging" ? -1 : 1);
  const soc = numericState(states[config.battery_soc_entity]);
  const loadWatts =
    solarWatts === null || batteryWatts === null
      ? null
      : solarWatts + batteryWatts;

  const batteryMode =
    batteryWatts === null
      ? "unavailable"
      : batteryWatts >= threshold
        ? "discharging"
        : batteryWatts <= -threshold
          ? "charging"
          : "idle";

  return {
    solar: {
      watts: solarWatts,
      energyTodayWh,
      warning: solarWatts !== null && solarWatts < 0,
    },
    battery: {
      soc,
      watts: batteryWatts,
      timeRemainingSeconds,
      mode: batteryMode,
      warning: soc !== null && (soc < 0 || soc > 100),
    },
    load: {
      watts: loadWatts,
      warning: loadWatts !== null && loadWatts < 0,
    },
    flows: {
      solar: flow(solarWatts, "to-bus", threshold, maxPower),
      battery:
        batteryWatts === null
          ? { direction: "stopped", intensity: 0 }
          : batteryWatts >= threshold
            ? flow(batteryWatts, "to-bus", threshold, maxPower)
            : flow(-batteryWatts, "from-bus", threshold, maxPower),
      load: flow(loadWatts, "from-bus", threshold, maxPower),
    },
  };
}
