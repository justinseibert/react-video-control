export interface Props {
  duration: number
  currentTime: number
  onSeek: (seconds: number) => void
  color?: Partial<ColorType>
}

export interface ColorType {
  trackBase: string
  trackActive: string
  thumb: string
}
