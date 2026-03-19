'use client'


import StorageManager from "../systems/storage/StorageManager.js"
import Desktop from "../components/Desktop"
import Dock from "../components/Dock"
import ShortcutIcon from "@/components/ShortcutIcon"
import IconManager from "@/systems/IconManager"
import { contextMenus } from "@/systems/contextMenuConfig.js"
import { useState , useEffect , useRef } from "react"

export default function Home() {

  const [ GRID_SIZE , setGRID_SIZE ] = useState(80)

  const desktopRef = useRef()
  const [ desktopSize , setdesktopSize ] = useState({ width: 0, height: 0 })

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

    if (isNaN(gridX) || isNaN(gridY)) return

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

    StorageManager.updateItem(draggingIconId, {
      gridX: snappedPreview.gridX,
      gridY: snappedPreview.gridY
    })

    setIcons(IconManager.getIcons())

    setDraggingIconId(null)
    draggingRef.current = null
    setSnappedPreview(null)
  }

  const [ renamingId , setRenamingId ] = useState(null)
  const [ renameValue , setRenameValue ] = useState("")

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
    const size = (6 * window.innerWidth) / 100
    setGRID_SIZE(size)

    if (desktopRef.current) {
      const rect = desktopRef.current.getBoundingClientRect()
      setdesktopSize({ width: rect.width, height: rect.height })
    }

    StorageManager.addItem("root", {
      id: "file-explorer",
      type: "folder",
      name: "File Explorer"
    })

    StorageManager.addItem("root", {
      id: "browser",
      type: "app",
      name: "Ace"
    })

    StorageManager.addItem("root", {
      id: "folder1",
      type: "folder",
      name: "Code"
    })

    const items = StorageManager.getChildren("root")

    items.forEach((item, index) => {
      IconManager.createIcon({
        id: item.id,
        name: item.name,
        type: item.type,
        iconPath: item.type === "folder" ? "/folder_icon.png" : "/window.svg",
        gridX: 0,
        gridY: index
      })
    })

    setIcons(IconManager.getIcons())
  }, [])

  const handleRenameSubmit = () => {
    if (!renamingId) return

    const newName = renameValue.trim()
    if (!newName) return

    StorageManager.updateItem(renamingId, {name: newName})
    IconManager.renameIcon(renamingId, newName)

    setIcons(IconManager.getIcons())

    setRenamingId(null)
    setRenameValue("")
  }

  const handleDesktopAction = (action) => {

    if (action === 'new-folder') {
      const id = "folder-" + crypto.randomUUID()

      const newItem = {
        id,
        type: 'folder',
        name: "New Folder"
      }

      StorageManager.addItem("root", newItem)

      IconManager.createIcon({
        id,
        name: newItem.name,
        type: "folder",
        iconPath: "/folder_icon.png",
        gridX: 0,
        gridY: 0
      })

      setIcons(IconManager.getIcons())

      setTimeout(()  => {
        setRenamingId(id)
        setRenameValue(newItem.name)
      }, 0)
    }

    if (action === "delete") {
      if (!contextMenu.target) return

      const id = contextMenu.target.id

      StorageManager.removeItem(id)
      IconManager.deleteIcon(id)

      setIcons(IconManager.getIcons())
    }

    if (action === "rename") {
      if (!contextMenu.target) return
      
      const id = contextMenu.target.id

      setRenamingId(id)
      setRenameValue(contextMenu.target.name)

      setContextMenu(prev => ({...prev , visible: false}))
    }

    if (action === 'new-file') {
      const id = crypto.randomUUID()

      const newItem = {
        id,
        type: "file",
        name: "Untitled"
      }

      StorageManager.addItem("root", newItem)

      IconManager.createIcon({
        id,
        type: "file",
        name: newItem.name,
        iconPath: "/file_icon.svg",
        gridX: 0,
        gridY: 0
      })

      setIcons(IconManager.getIcons())

      setTimeout(()  => {
        setRenamingId(id)
        setRenameValue(newItem.name)
      }, 0)
    }

    if (action === "open-terminal") {
      console.log("Opened Terminal");
    }

    if (action === "change-wallpaper") {
      console.log("Changed Wallpaper");
    }

  }


    const [ contextMenu , setContextMenu ] = useState({
        visible: false,
        x: 0,
        y: 0,
        type: null,
        target: null
    })

    const handleContextMenu = (e, target) => {
        e.preventDefault()

        const type = target ? target.type : 'desktop'

        const menuWidth = 180
        const menuHeight = 16 + ( (contextMenus[type]?.length || 0) * 40 )

        let x = e.clientX
        let y = e.clientY

        if (x + menuWidth > window.innerWidth) { x = window.innerWidth - menuWidth }

        if (y + menuHeight > window.innerHeight) { y = window.innerHeight - menuHeight }

        setContextMenu({
            visible: true,
            x: x,
            y: y,
            type: type,
            target: target
        })
    }
    
    const onCloseContextMenu = () => {
      setContextMenu(prev => ({
        ...prev,
        visible: false
      }))
    }

    useEffect(() => {

      const size = (6 * window.innerWidth) / 100
      setGRID_SIZE(size)

      if (desktopRef.current) {
        const rect = desktopRef.current.getBoundingClientRect()
        setdesktopSize({ width: rect.width, height: rect.height })
      }

      StorageManager.addItem("root", {
        id: "file-explorer",
        type: "folder",
        name: "File Explorer"
      })

      StorageManager.addItem("root", {
        id: "browser",
        type: "app",
        name: "Ace"
      })

      StorageManager.addItem("root", {
        id: "folder1",
        type: "folder",
        name: "Code"
      })

      const items = StorageManager.getChildren("root")

      items.forEach((item, index) => {
        IconManager.createIcon({
          id: item.id ,
          name: item.name,
          type: item.type,
          iconPath: item.type === "folder" ? "/folder_icon.png" : "/window.svg",
          gridX: 0,
          gridY: index
        })
      })

      setIcons(IconManager.getIcons())

    }, [])

  return (
    <>
      <div className="h-screen w-screen overflow-hidden">
        <Desktop 
          ref={desktopRef}
          onAction={handleDesktopAction}
          onContextMenu={handleContextMenu}
          onClick={onCloseContextMenu}
        >
          {contextMenu.visible && (
            <div
              style={{
                position: 'absolute',
                top: contextMenu.y,
                left: contextMenu.x,
                background: "#222",
                color: "white",
                padding: "8px",
                borderRadius: "6px",
                width: `180px`
              }}
            >
              {contextMenus[contextMenu.type]?.map((item) => (
                <div
                  key={item.action}
                  onClick={() => handleDesktopAction(item.action)}
                  className="p-2 hover:bg-gray-700 cursor-pointer"
                >
                  {item.label}
                </div>
              ))}
            </div>
          )}

          {icons.map(icon => {

            let x = icon.gridX * GRID_SIZE + (GRID_SIZE - ICON_SIZE) / 2
            let y = icon.gridY * GRID_SIZE + (GRID_SIZE - ICON_SIZE) / 2

            if (draggingIconId === icon.id && snappedPreview) {
              x = snappedPreview.x + (GRID_SIZE - ICON_SIZE) / 2
              y = snappedPreview.y + (GRID_SIZE - ICON_SIZE) / 2
            }

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
                onContextMenu={(e) => {
                  e.stopPropagation()
                  handleContextMenu(e, icon)
                }}
                isRenaming={renamingId === icon.id}        
                renameValue={renameValue}                  
                setRenameValue={setRenameValue}            
                onRenameSubmit={handleRenameSubmit}        
              />
            )
          })}

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