import { LitElement, css, html, nothing, svg } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { formatDuration, formatEnergy, formatPower } from "./format";
import {
  derivePowerSystem,
  normalizeConfig,
  type HomeAssistantState,
  type NormalizedOffgridPowerCardConfig,
  type PowerFlow,
} from "./power-system";

export interface HomeAssistant {
  states: Record<string, HomeAssistantState>;
  locale?: { language?: string };
  language?: string;
}

declare global {
  interface HTMLElementTagNameMap {
    "offgrid-power-card": OffgridPowerCard;
  }

  interface Window {
    customCards?: Array<{
      type: string;
      name: string;
      description: string;
      preview?: boolean;
    }>;
  }
}

@customElement("offgrid-power-card")
export class OffgridPowerCard extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private config?: NormalizedOffgridPowerCardConfig;
  @state() private wide = false;
  @state() private compact = false;

  private resizeObserver?: ResizeObserver;

  public setConfig(config: unknown): void {
    this.config = normalizeConfig(config);
  }

  public getCardSize(): number {
    return 4;
  }

  public getGridOptions(): Record<string, number | string> {
    return {
      columns: "full",
      min_columns: 6,
      rows: 4,
      min_rows: 3,
    };
  }

  public override connectedCallback(): void {
    super.connectedCallback();
    this.resizeObserver = new ResizeObserver(([entry]) => {
      if (!entry) return;
      const nextWide = entry.contentRect.width >= entry.contentRect.height * 1.25;
      if (nextWide !== this.wide) this.wide = nextWide;
      const nextCompact = entry.contentRect.height <= 200;
      if (nextCompact !== this.compact) this.compact = nextCompact;
    });
    this.resizeObserver.observe(this);
  }

  public override disconnectedCallback(): void {
    this.resizeObserver?.disconnect();
    super.disconnectedCallback();
  }

  protected override render() {
    if (!this.config || !this.hass) return nothing;

    const system = derivePowerSystem(this.config, this.hass.states);
    const locale =
      this.hass.locale?.language ?? this.hass.language ?? navigator.language;
    const soc = system.battery.soc;
    const boundedSoc = soc === null ? 0 : Math.min(100, Math.max(0, soc));

    return html`
      <ha-card data-layout=${this.wide ? "wide" : "tall"} data-compact=${this.compact ? "true" : "false"}>
        ${this.config.title
          ? html`<div class="title">${this.config.title}</div>`
          : nothing}
        <div class="diagram" aria-label="Off-grid electrical power flow">
          ${this.renderFlows(system.flows)}

          <section class="node solar ${system.solar.warning ? "warning" : ""}">
            <ha-icon icon=${this.config.solar_icon ?? "mdi:white-balance-sunny"}></ha-icon>
            <div class="node-copy">
              <span class="label">${this.config.solar_label ?? "Solar"}</span>
              <strong>${formatPower(system.solar.watts, locale)}</strong>
              ${this.config.solar_energy_today_entity
                ? html`<span class="secondary">${formatEnergy(system.solar.energyTodayWh, locale)} today</span>`
                : nothing}
            </div>
            ${this.warning(system.solar.warning, "Solar power is negative")}
          </section>

          <div class="bus" aria-label="Power bus"></div>

          <section class="node battery ${system.battery.warning ? "warning" : ""}">
            <div class="node-heading">
              <ha-icon icon=${this.config.battery_icon ?? "mdi:battery"}></ha-icon>
              <span class="label">${this.config.battery_label ?? "Battery"}</span>
              ${this.warning(
                system.battery.warning,
                "Battery state of charge is outside 0–100%",
              )}
              <strong class="soc-value">${soc === null ? "—" : `${new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(soc)}%`}</strong>
            </div>
            <div class="battery-bar" role="meter" aria-label="Battery state of charge" aria-valuemin="0" aria-valuemax="100" aria-valuenow=${soc ?? nothing}>
              <div class="battery-fill" style=${`width:${boundedSoc}%`}></div>
            </div>
            ${this.config.battery_time_remaining_entity
              ? html`<span class="secondary time">${formatDuration(system.battery.timeRemainingSeconds, locale)} ${system.battery.mode === "charging" ? "until full" : "remaining"}</span>`
              : nothing}
          </section>

          <section class="node load ${system.load.warning ? "warning" : ""}">
            <ha-icon icon=${this.config.load_icon ?? "mdi:home-lightning-bolt"}></ha-icon>
            <div class="node-copy">
              <span class="label">${this.config.load_label ?? "Load"}</span>
              <strong>${formatPower(system.load.watts, locale)}</strong>
            </div>
            ${this.warning(
              system.load.warning,
              "Calculated consumption is negative",
            )}
          </section>
        </div>
      </ha-card>
    `;
  }

  private warning(show: boolean, label: string) {
    return show
      ? html`<ha-icon class="warning-icon" icon="mdi:alert-circle-outline" title=${label} aria-label=${label}></ha-icon>`
      : nothing;
  }

  private renderFlows(flows: {
    solar: PowerFlow;
    battery: PowerFlow;
    load: PowerFlow;
  }) {
    const paths = this.wide
      ? {
          solar: "M 22 36 L 48 36",
          battery: "M 50 78 L 50 40",
          load: "M 52 36 L 78 36",
        }
      : {
          solar: "M 62 18 L 62 46",
          battery: "M 62 82 L 62 54",
          load: "M 60 50 L 47 50",
        };

    return html`
      <svg class="flows" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <marker id="flow-arrow" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto-start-reverse" markerUnits="strokeWidth">
            <path d="M 0 0 L 5 2.5 L 0 5 z"></path>
          </marker>
        </defs>
        ${this.flowPath(paths.solar, flows.solar)}
        ${this.flowPath(paths.battery, flows.battery, true)}
        ${this.flowPath(paths.load, flows.load)}
      </svg>
    `;
  }

  private flowPath(
    path: string,
    flow: PowerFlow,
    reverseWhenFromBus = false,
  ) {
    const active = flow.direction !== "stopped";
    const isReverse = reverseWhenFromBus && flow.direction === "from-bus";
    const gap = 24 - flow.intensity * 12;

    return svg`
      <path class="flow-base" d=${path}></path>
      <path
        class="flow-active ${active ? "active" : ""} ${isReverse ? "reverse" : ""}"
        d=${path}
        pathLength="100"
        style=${`--flow-gap:${gap}`}
        marker-start=${active && isReverse ? "url(#flow-arrow)" : nothing}
        marker-end=${active && !isReverse ? "url(#flow-arrow)" : nothing}
      ></path>
    `;
  }

  static override styles = css`
    :host {
      display: block;
      height: 100%;
      min-height: 184px;
      color: var(--primary-text-color);
      container-type: inline-size;
    }

    ha-card {
      display: block;
      height: 100%;
      min-height: 184px;
      box-sizing: border-box;
      overflow: hidden;
      background: var(--ha-card-background, var(--card-background-color));
    }

    .title {
      padding: 16px 16px 0;
      font-size: 18px;
      font-weight: 500;
    }

    .diagram {
      position: relative;
      height: 100%;
      min-height: 184px;
      box-sizing: border-box;
    }

    .title + .diagram {
      height: calc(100% - 48px);
      min-height: 136px;
    }

    ha-card[data-compact="true"] .title,
    ha-card[data-compact="true"] .secondary.time {
      display: none;
    }

    ha-card[data-compact="true"] .title + .diagram {
      height: 100%;
      min-height: 184px;
    }

    ha-card[data-compact="true"] .battery {
      gap: 5px;
      padding-block: 8px;
    }

    .flows {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      overflow: visible;
      pointer-events: none;
    }

    .flow-base,
    .flow-active {
      fill: none;
      vector-effect: non-scaling-stroke;
      stroke-linecap: round;
    }

    .flow-base {
      stroke: var(--divider-color);
      stroke-width: 2;
    }

    .flow-active {
      stroke: var(--primary-color);
      stroke-width: 2.5;
      stroke-dasharray: 4 var(--flow-gap);
      opacity: 0;
    }

    .flow-active.active {
      opacity: 0.72;
      animation: flow-pulse 3.4s linear infinite;
      transition: stroke-dasharray 500ms ease, opacity 300ms ease;
    }

    .flow-active.reverse {
      animation-direction: reverse;
    }

    marker path {
      fill: var(--primary-color);
      stroke: none;
    }

    @keyframes flow-pulse {
      to { stroke-dashoffset: -28; }
    }

    .node {
      position: absolute;
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 112px;
      max-width: 176px;
      box-sizing: border-box;
      padding: 10px 12px;
      border: 1px solid var(--divider-color);
      border-radius: var(--ha-card-border-radius, 12px);
      background: var(--ha-card-background, var(--card-background-color));
      box-shadow: var(--ha-card-box-shadow, none);
      transform: translate(-50%, -50%);
    }

    .node ha-icon {
      flex: 0 0 auto;
      color: var(--secondary-text-color);
      --mdc-icon-size: 25px;
    }

    .node-copy,
    .battery {
      flex-direction: column;
      align-items: stretch;
    }

    .node-copy {
      display: flex;
      min-width: 0;
    }

    .label,
    .secondary {
      color: var(--secondary-text-color);
      font-size: 12px;
      line-height: 1.35;
    }

    strong {
      font-size: 20px;
      font-weight: 500;
      line-height: 1.25;
      white-space: nowrap;
    }

    .battery {
      width: 176px;
      gap: 7px;
    }

    .node-heading {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .node-heading .label {
      flex: 1;
    }


    .battery-bar {
      width: 100%;
      height: 8px;
      overflow: hidden;
      border-radius: 999px;
      background: var(--divider-color);
    }

    .battery-fill {
      height: 100%;
      border-radius: inherit;
      background: var(--primary-color);
      transition: width 400ms ease;
    }

    .warning strong,
    .warning .secondary,
    .warning-icon {
      color: var(--warning-color, var(--state-climate-heat-color));
    }

    .warning-icon {
      --mdc-icon-size: 18px !important;
    }

    .bus {
      position: absolute;
      left: 50%;
      top: 50%;
      width: 12px;
      height: 12px;
      border: 3px solid var(--primary-color);
      border-radius: 50%;
      background: var(--ha-card-background, var(--card-background-color));
      transform: translate(-50%, -50%);
      box-sizing: border-box;
    }

    ha-card[data-layout="wide"] .solar { left: 16%; top: 36%; }
    ha-card[data-layout="wide"] .bus { left: 50%; top: 36%; }
    ha-card[data-layout="wide"] .load { left: 84%; top: 36%; }
    ha-card[data-layout="wide"] .battery { left: 50%; top: 78%; }

    ha-card[data-layout="tall"] .solar { left: 62%; top: 13%; }
    ha-card[data-layout="tall"] .bus { left: 62%; top: 50%; }
    ha-card[data-layout="tall"] .load { left: 25%; top: 50%; }
    ha-card[data-layout="tall"] .battery { left: 62%; top: 87%; }

    @container (max-width: 390px) {
      .node { min-width: 100px; padding: 8px 10px; }
      .battery { width: 150px; }
      .secondary.time { display: none; }
    }

    @container (max-width: 320px) {
      .title { display: none; }
      .node { min-width: 92px; }
      .battery { width: 136px; }
      .solar .secondary { display: none; }
    }

    @media (prefers-reduced-motion: reduce) {
      .flow-active.active { animation: none; }
      .battery-fill { transition: none; }
    }
  `;
}

window.customCards = window.customCards ?? [];
if (!window.customCards.some((card) => card.type === "offgrid-power-card")) {
  window.customCards.push({
    type: "offgrid-power-card",
    name: "Off-grid Power Card",
    description: "Solar, battery, and calculated load power flows.",
    preview: true,
  });
}
