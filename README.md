## Video Controls

### Install

Install using `npm install @justinseibert/react-video-control`

### Usage

```tsx
import Slider from '@justinseibert/react-video-control'

/* ... */

const videoRef = useRef(null)
const [duration, setDuration] = useState<second>(100)
const [currentTime, setCurrentTime] = useState<number>(0)

const handleSeek = useCallback((time: second) => {
	if (videoRef && videoRef.current) {
		const video = videoRef.current as HTMLMediaElement
		video.fastSeek(time)
	}
}, [])

const onLoadedData = useCallback(() => {
	if (videoRef && videoRef.current) {
		const video = videoRef.current as HTMLMediaElement
		setDuration(video.duration)
		handleSeek(0)
	}
}, [handleSeek])

return (
	<video
		ref={videoRef}
		onLoadedData={onLoadedData}
		onTimeUpdate={(event: any) => setCurrentTime(event.target.currentTime)}
		controls={false}
		src={/* ... */}
	/>
	<Slider
		duration={duration}
		currentTime={currentTime}
		onSeek={(time: number) => handleSeek(time)}
		color={{
		trackActive: `#49eedc`,
		trackBase: `#eee`,
		thumb: `#0057b8`,
		}}
	/>
)
```
