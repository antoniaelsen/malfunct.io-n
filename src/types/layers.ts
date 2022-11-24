export interface Layer {
  id: number,
  label: string,
  opacity: number,
  visible: boolean
}

export interface LayerState {
  layers: Layer[],
  layerIdNext: number,
}