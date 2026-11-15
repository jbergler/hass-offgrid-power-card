import { describe, expect, it } from "vitest";
import { formatDuration, formatEnergy, formatPower } from "../src/format";

describe("telemetry formatting", () => {
  it("uses compact adaptive units without hiding signed measurements", () => {
    expect(formatPower(999, "en-US")).toBe("999 W");
    expect(formatPower(1450, "en-US")).toBe("1.5 kW");
    expect(formatPower(-1200, "en-US")).toBe("-1.2 kW");
    expect(formatPower(null, "en-US")).toBe("—");
    expect(formatPower(32.4, "en-US", 0)).toBe("32 W");
    expect(formatEnergy(1750, "en-US")).toBe("1.8 kWh");
    expect(formatDuration(9000, "en-US")).toBe("2 h 30 min");
  });
});
