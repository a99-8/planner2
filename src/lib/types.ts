export interface SettlementSettings {
  isAuto: boolean;
  isInterpolated: boolean;
  baseSettlement: number;
  increment: number;
}

export interface ColumnDetails {
  minVal: number;
  maxVal: number;
  groupCount: number;
  displayHeaders: string[];
  middleIdx: number;
  isEven: boolean;
  isNumeric: boolean;
  settings: SettlementSettings;
}
