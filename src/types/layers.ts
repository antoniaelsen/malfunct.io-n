export enum PixelSortDirection {
  DOWNWARD = "downward",
  UPWARD = "upward",
  LTR = "left to right",
  RTL = "right to left"
};

export enum PixelSortOperator {
  GTEQ = ">=",
  GT = ">",
  EQ = "=",
  LT = "<",
  LTEQ = "<=",
};

export enum PixelSortProperty {
  HUE = "hue",
  SATURATION = "saturation",
  LUMINOSITY = "luminosity",
  RED = "r",
  GREEN = "g",
  BLUE = "b",
};

export interface PixelSortScanConfig {
  scan: PixelSortDirection;
  property: PixelSortProperty;
  operator: PixelSortOperator;
  value: string;
}
export interface PixelSortConfig {
  sort: PixelSortDirection;
  
  start: PixelSortScanConfig;
  end: PixelSortScanConfig;
};

export interface Layer {
  id: number;
  label: string;
  opacity: number;
  visible: boolean;
  mode?: string | null;
  config?: PixelSortConfig;
}

export interface LayerState {
  layers: Layer[],
  layerIdNext: number,
}
