
export type LabelType = "UnableToDetermine" | "Healthy" | "Compensatory_Manually" | "Compensatory_SystemDetected" | "CurrentlySelected";

export type Info = {
  color: string;
  description: string;
}

export const CompensationType_COLORS: Record<LabelType, Info> = {
  UnableToDetermine: { color: "#D9D9D9", description: "Unable to determine" },
  Healthy: { color: "#67E564", description: "Healthy" },
  Compensatory_Manually: { color: "#FFA902", description: "Compensatory(manually)" },
  Compensatory_SystemDetected: { color: "#FC0E0E", description: "Compensatory(system detected)" },
  CurrentlySelected: { color: "#34D5F9", description: "Currently selected" }
}