import React, { useState } from 'react'
import Slider from './component'

const App: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<number>(0)
  return (
    <Slider
      duration={300}
      currentTime={currentTime}
      onSeek={(time: number) => setCurrentTime(time)}
      color={{
        trackActive: `#49eedc`,
        trackBase: `#eee`,
        thumb: `#0057b8`,
      }}
    />
  )
}

export default App
