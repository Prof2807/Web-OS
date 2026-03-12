'use client'

import Desktop from "../components/Desktop"
import Dock from "../components/Dock"
import ShortcutIcon from "@/components/ShortcutIcon"
import { useState , useEffect , useRef } from "react"

export default function Home() {

  const [ GRID_SIZE , setGRID_SIZE ] = useState(80)

  const desktopRef = useRef()
  const [ desktopSize , setdesktopSize ] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const size = (6 * window.innerWidth) / 100
    setGRID_SIZE(size)

    if (desktopRef.current) {
      const rect = desktopRef.current.getBoundingClientRect()

      setdesktopSize({ width: rect.width, height: rect.height })
    }

  }, [])

  const ICON_SIZE = GRID_SIZE * 0.8

  const [ draggingIcon , setDraggingIcon ] = useState(null)
  const [ dragOffset , setDragOffset ] = useState({ x: 0, y: 0 })
  const [ snappedPreview , setSnappedPreview ] = useState(null)
  const [icons, setIcons] = useState({
    "File Explorer": { x: null, y: null }
  })
    
  const handleMouseDown = (name , e) => {
    setDraggingIcon(name)
    let offsetX = e.clientX - icons[name].x
    let offsetY = e.clientY - icons[name].y
    setDragOffset({ x: offsetX ?? 0, y: offsetY ?? 0 })
  }

  const handleMouseMove = (e) => {
    if (draggingIcon) {
      setIcons(prevIcons => ({
        ...prevIcons,
        [draggingIcon]: { x: e.clientX - dragOffset.x ?? 0, y: e.clientY - dragOffset.y ?? 0 }
      }))

      const iconX = e.clientX - dragOffset.x
      const iconY = e.clientY - dragOffset.y

      const maxCols = Math.floor((desktopSize.width - ICON_SIZE) / GRID_SIZE)
      const maxRows = Math.floor((desktopSize.height - ICON_SIZE) / GRID_SIZE)

      let gridX = Math.round(iconX / GRID_SIZE)
      let gridY = Math.round(iconY / GRID_SIZE)

      gridX = Math.max(0, Math.min(gridX, maxCols))
      gridY = Math.max(0, Math.min(gridY, maxRows))

      setSnappedPreview({
        x: gridX * GRID_SIZE,
        y: gridY * GRID_SIZE
      })
    }
  }

  const handleMouseUp = () => {
    if (draggingIcon) {

      let iconX = icons[draggingIcon].x
      let iconY = icons[draggingIcon].y

      let gridX = Math.round(iconX / GRID_SIZE)
      let gridY = Math.round(iconY / GRID_SIZE)

      const maxCols = Math.floor((desktopSize.width - ICON_SIZE) / GRID_SIZE)
      const maxRows = Math.floor((desktopSize.height - ICON_SIZE) / GRID_SIZE)

      gridX = Math.max(0, Math.min(gridX, maxCols))
      gridY = Math.max(0, Math.min(gridY, maxRows))

      const snappedX = gridX * GRID_SIZE + (GRID_SIZE - ICON_SIZE) / 2
      const snappedY = gridY * GRID_SIZE + (GRID_SIZE - ICON_SIZE) / 2

      setIcons(prev => ({
        ...prev,
        [draggingIcon]: { x: snappedX, y: snappedY }
      }))

      setSnappedPreview(null)
    }

    setDraggingIcon(null)
  }

  return (
    <>
      <div className="h-screen w-screen overflow-hidden">
        <Desktop 
          ref={desktopRef}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}  
        >
          {/* desktop icons later */}
          {/* use public‑asset path; relative URL from root */}
          <ShortcutIcon 
            icon="/file.svg" 
            name="File Explorer" 
            onMouseDown={handleMouseDown}
            x={icons["File Explorer"].x ?? 0}
            y={icons["File Explorer"].y ?? 0}
            />

            {snappedPreview && (
              <div
                style={{
                  position: "absolute",
                  left: snappedPreview.x,
                  top: snappedPreview.y,
                  width: GRID_SIZE,
                  height: GRID_SIZE,
                  border: " 2px solid rgba(255,255,255,0.6) ",
                  background: "rgba(255,255,255,0.1)",
                  pointerEvents: "none"
                }}
              />
            )}

        </Desktop>

        <div className="h-[8vh]">
          <Dock />
        </div>
      </div>
    </>
  )
}