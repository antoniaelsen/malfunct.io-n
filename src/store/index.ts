export interface Layer {
  label: string,
  opacity: number,
  visible: boolean
}

export interface GlobalState {
  layers: Layer[],
  theme: string,
}


export const initialState = {
  layers: [
    {
      label: 'Layer 2',
      opacity: 100,
      visible: true,
    },
    {
      label: 'Layer 1',
      opacity: 100,
      visible: true,
    },
    {
      label: 'Layer 0',
      opacity: 100,
      visible: true,
    },
  ],
  theme: 'dark',
}


