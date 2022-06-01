import { drag as d3Drag } from 'd3-drag'
import { select as d3Select } from 'd3-selection'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import { Props } from './Types'

const dpi = 2
const height = 40
const radiusInactive = height * 0.5
const radiusActive = height
const centerY = height
const lineHeight = 8
const r360 = Math.PI * 2

const SliderComponent: React.FC<Props> = ({ duration, currentTime, onSeek, color = {} }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const dragStart = useRef<number>(-1)
  const dragEnd = useRef<number>(-1)
  const [radius, setRadius] = useState<number>(radiusInactive)
  const [position, setPosition] = useState<number>(0)
  const [width, setWidth] = useState<number>(1)

  useEffect(() => {
    // triggers track reset during navigation
    dragStart.current = -1
    dragEnd.current = -1
  }, [duration])

  const initializeCanvas = useCallback(() => {
    if (ctxRef.current) {
      return
    } else if (canvasRef && canvasRef.current) {
      const canvas = canvasRef.current
      const width = canvas.clientWidth
      canvas.width = width * dpi
      canvas.height = height * dpi
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      setWidth(width * dpi)

      ctxRef.current = canvas.getContext('2d')
      const drag = d3Drag() as any
      drag
        .on('start', (data: any) => {
          setRadius(radiusActive)
          setPosition(data.x * dpi)
          dragStart.current = dragEnd.current
        })
        .on('drag', (data: any) => {
          setPosition(data.x * dpi)
        })
        .on('end', (data: any) => {
          setPosition(data.x * dpi)
          setRadius(radiusInactive)
          // handled as ref because d3 events/mutations are unaware of react state changes
          dragEnd.current++
        })
      const selection = d3Select(canvas)
      selection.call(drag)
    }
  }, [])

  useEffect(() => {
    initializeCanvas()
    // update position during regulat playback
    if (dragStart.current !== dragEnd.current || dragStart.current < 0) {
      setPosition((currentTime / duration) * width)
    }
  }, [initializeCanvas, currentTime, duration, width])

  useEffect(() => {
    const ctx = ctxRef.current
    if (!ctx) {
      return
    }

    ctx.clearRect(0, 0, width, height * dpi)

    ctx.lineCap = 'round'
    ctx.lineWidth = lineHeight

    // draw base track
    ctx.strokeStyle = color.trackBase || '#fdd'
    ctx.beginPath()
    ctx.moveTo(0 + lineHeight, centerY)
    ctx.lineTo(width - lineHeight, centerY)
    ctx.stroke()

    // draw active track
    ctx.strokeStyle = color.trackActive || '#faa'
    ctx.lineWidth = lineHeight + 2
    ctx.beginPath()
    ctx.moveTo(0 + lineHeight, centerY)
    ctx.lineTo(position, centerY)
    ctx.stroke()

    // bound the thumb position to inside of canvas
    let x = position
    if (position < radius) {
      x = radius
    }
    if (x >= width) {
      x = width - radius
    }

    // draw thumb
    ctx.fillStyle = color.thumb || '#f44'
    ctx.beginPath()
    ctx.arc(x, centerY, radius, 0, r360)
    ctx.fill()

    // only trigger seek when drag is complete
    if (dragStart.current !== dragEnd.current) {
      onSeek((position / width) * duration)
      // make sure it only happens once after a drag
      dragStart.current = dragEnd.current
    }
  }, [ctxRef, position, width, radius, duration, onSeek, color])

  return <canvas style={{ minWidth: '100%' }} ref={canvasRef} />
}

export default SliderComponent
