import { useCallback, useRef, useState } from 'react'

interface PanZoomState {
  scale: number
  x: number
  y: number
}

const MIN_SCALE = 0.5
const MAX_SCALE = 2.5

export function usePanZoom(initialScale = 1) {
  const [state, setState] = useState<PanZoomState>({
    scale: initialScale,
    x: 0,
    y: 0,
  })
  const dragging = useRef(false)
  const lastPoint = useRef({ x: 0, y: 0 })

  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.08 : 0.08
    setState((s) => ({
      ...s,
      scale: Math.min(MAX_SCALE, Math.max(MIN_SCALE, s.scale + delta)),
    }))
  }, [])

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (e.button !== 0) return
    dragging.current = true
    lastPoint.current = { x: e.clientX, y: e.clientY }
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }, [])

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return
    const dx = e.clientX - lastPoint.current.x
    const dy = e.clientY - lastPoint.current.y
    lastPoint.current = { x: e.clientX, y: e.clientY }
    setState((s) => ({ ...s, x: s.x + dx, y: s.y + dy }))
  }, [])

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    dragging.current = false
    ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
  }, [])

  const reset = useCallback(() => {
    setState({ scale: initialScale, x: 0, y: 0 })
  }, [initialScale])

  const zoomIn = useCallback(() => {
    setState((s) => ({
      ...s,
      scale: Math.min(MAX_SCALE, s.scale + 0.15),
    }))
  }, [])

  const zoomOut = useCallback(() => {
    setState((s) => ({
      ...s,
      scale: Math.max(MIN_SCALE, s.scale - 0.15),
    }))
  }, [])

  return {
    ...state,
    onWheel,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    reset,
    zoomIn,
    zoomOut,
  }
}
