'use client'

import Desktop from "../components/Desktop"
import Dock from "../components/Dock"
import ShortcutIcon from "@/components/ShortcutIcon"
import IconManager from "@/systems/IconManager"
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

    IconManager.createIcon({
      name: "File Explorer",
      type: "folder",
      iconPath: "/file.svg",
      gridX: 0,
      gridY: 0
    })

    IconManager.createIcon({
      name: "Browser",
      type: "app",
      iconPath: "/globe.svg",
      gridX: 0,
      gridY: 1
    })

    IconManager.createIcon({
      name: "Triangle",
      type: "app",
      iconPath: "/vercel.svg",
      gridX: 0,
      gridY: 2
    })

    IconManager.createIcon({
      name: "Triangle",
      type: "app",
      iconPath: "/vercel.svg",
      gridX: 0,
      gridY: 3
    })

    IconManager.createIcon({
      name: "Terminal",
      type: "app",
      iconPath: "/window.svg",
      gridX: 0,
      gridY: 4
    })

    setIcons(IconManager.getIcons())

  }, [])

  const ICON_SIZE = GRID_SIZE * 0.8

  const [ draggingIconId , setDraggingIconId ] = useState(null)
  const [ dragOffset , setDragOffset ] = useState({ x: 0, y: 0 })
  const [ snappedPreview , setSnappedPreview ] = useState(null)
  const [icons, setIcons] = useState([])
  const draggingRef = useRef(null)
    
  const handleMouseDown = (id , e) => {
    draggingRef.current = id
    setDraggingIconId(id)

    const icon = icons.find(icon => icon.id === id)

    if (!icon) return

    const iconX = icon.gridX * GRID_SIZE + (GRID_SIZE - ICON_SIZE) / 2
    const iconY = icon.gridY * GRID_SIZE + (GRID_SIZE - ICON_SIZE) / 2

    let offsetX = e.clientX - iconX
    let offsetY = e.clientY - iconY

    setDragOffset({ x: offsetX ?? 0, y: offsetY ?? 0 })
  }

  const handleMouseMove = (e) => {
    if (!draggingRef.current) return
    if (!GRID_SIZE) return

    const iconX = e.clientX - dragOffset.x
    const iconY = e.clientY - dragOffset.y

    const maxCols = Math.floor((desktopSize.width - ICON_SIZE) / GRID_SIZE)
    const maxRows = Math.floor((desktopSize.height - ICON_SIZE) / GRID_SIZE)

    let gridX = Math.round(iconX / GRID_SIZE)
    let gridY = Math.round(iconY / GRID_SIZE)

    gridX = Math.max(0, Math.min(gridX, maxCols))
    gridY = Math.max(0, Math.min(gridY, maxRows))

    console.log("Dragging " + draggingIconId);
    

    if (isNaN(gridX) || isNaN(gridY)) return

    console.log("Computed Grid: ", gridX, gridY);
    console.log("Computed Pixels: ", gridX * GRID_SIZE,gridY * GRID_SIZE);
    
    

    setSnappedPreview({
      gridX,
      gridY,
      x: gridX * GRID_SIZE,
      y: gridY * GRID_SIZE
    })
  }

  const handleMouseUp = () => {
    
    if (!draggingRef.current || !snappedPreview) return

    IconManager.updateIconPosition(
      draggingIconId,
      snappedPreview.gridX,
      snappedPreview.gridY
    )

    setIcons(IconManager.getIcons())

    setDraggingIconId(null)
    draggingRef.current = null
    setSnappedPreview(null)
  }

  useEffect(() => {

    const move = (e) => handleMouseMove(e)
    const up = (e) => handleMouseUp(e)

    window.addEventListener("mousemove", move)
    window.addEventListener("mouseup", up)

    return () => {
      window.removeEventListener("mousemove", move)
      window.removeEventListener("mouseup", up)
    }
  }, [draggingIconId, dragOffset, snappedPreview])

  useEffect(() => {
    console.log("Preview updated: ", snappedPreview);
    
  }, [snappedPreview])

  return (
    <>
      <div className="h-screen w-screen overflow-hidden">
        <Desktop 
          ref={desktopRef}
          // onMouseMove={handleMouseMove}
          // onMouseUp={handleMouseUp}  
        >

          {icons.map(icon => {

            let x = icon.gridX * GRID_SIZE + (GRID_SIZE - ICON_SIZE) / 2
            let y = icon.gridY * GRID_SIZE + (GRID_SIZE - ICON_SIZE) / 2

            if (draggingIconId === icon.id && snappedPreview) {
              x = snappedPreview.x + (GRID_SIZE - ICON_SIZE) / 2
              y = snappedPreview.y + (GRID_SIZE - ICON_SIZE) / 2
            }

            console.log(`Rendering icon ${icon.name} at grid (${icon.gridX}, ${icon.gridY}) with pixel position (${x}, ${y})`)

            return (
              <ShortcutIcon
                key={icon.id}
                icon={icon.iconPath}
                name={icon.name}
                size={ICON_SIZE}
                x={x}
                y={y}
                onMouseDown={(e) => {
                  e.stopPropagation()
                  handleMouseDown(icon.id , e) 
                }}
              />
            )
          })}

            {console.log("Redndering preview check: " , snappedPreview)}

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