'use client'


import StorageManager from "../systems/storage/StorageManager.js"
import Desktop from "../components/Desktop"
import Dock from "../components/Dock"
import ShortcutIcon from "@/components/ShortcutIcon"
import IconManager from "@/systems/IconManager"
import { contextMenus } from "@/systems/contextMenuConfig.js"
import { useState, useEffect, useRef } from "react"

export default function Home() {

  const [GRID_SIZE, setGRID_SIZE] = useState(80)

  const desktopRef = useRef()
  const [desktopSize, setdesktopSize] = useState({ width: 0, height: 0 })

  const ICON_SIZE = GRID_SIZE * 0.8

  const [draggingIconId, setDraggingIconId] = useState(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [snappedPreview, setSnappedPreview] = useState(null)
  const [icons, setIcons] = useState([])
  const draggingRef = useRef(null)
  const [ draggingIds, setDraggingIds ] = useState([])
  const [ initialPositions, setInitialPositions ] = useState({})
  const [ draggingPreview, setDraggingPreview ] = useState(null)

  const [isSelecting, setIsSelecting] = useState(false)
  const [selectionStart, setSelectionStart] = useState({ x: 0, y: 0 })
  const [selectionBox, setSelectionBox] = useState(null)
  const [selectedIcons, setSelectedIcons] = useState([])

  const handleMouseDown = (id, e) => {
    if (isContextMenuOpen) return

    let dragIds = []

    if (selectedIcons.includes(id)) {
      dragIds = selectedIcons
    } else {
      dragIds = [id]
      setSelectedIcons([id])
    }

    setDraggingIds(dragIds)
    draggingRef.current = dragIds

    const positions = {}
    dragIds.forEach(iconId => {
      const icon = icons.find(i => i.id === iconId)
      if (!icon) return
      positions[iconId] = { gridX: icon.gridX, gridY: icon.gridY }
    })

    setInitialPositions(positions)

    const mainIcon = icons.find(icon => icon.id === id) 
    if (!mainIcon) return

    setDraggingIconId(id)

    const iconX = mainIcon.gridX * GRID_SIZE + (GRID_SIZE - ICON_SIZE) / 2
    const iconY = mainIcon.gridY * GRID_SIZE + (GRID_SIZE - ICON_SIZE) / 2

    let offsetX = e.clientX - iconX
    let offsetY = e.clientY - iconY

    setDragOffset({ x: offsetX ?? 0, y: offsetY ?? 0 })
  }

  const handleMouseMove = (e) => {

    if (isSelecting) {

      const x1 = selectionStart.x
      const y1 = selectionStart.y
      const x2 = e.clientX
      const y2 = e.clientY

      const box = {
        x: Math.min(x1, x2),
        y: Math.min(y1, y2),
        width: Math.abs(x2 - x1),
        height: Math.abs(y2 - y1)
      }

      setSelectionBox(box)

      const selected = icons.filter(icon => {
        const iconX = icon.gridX * GRID_SIZE
        const iconY = icon.gridY * GRID_SIZE

        return (
          iconX < box.x + box.width &&
          iconX + GRID_SIZE > box.x &&
          iconY < box.y + box.height &&
          iconY + GRID_SIZE > box.y
        )
      })

      setSelectedIcons(selected.map(i => i.id))

      return

    }

    if (!draggingRef.current) return
    if (!GRID_SIZE) return
    if (isContextMenuOpen) return



    const iconX = e.clientX - dragOffset.x
    const iconY = e.clientY - dragOffset.y

    let anchorGridX = Math.round(iconX / GRID_SIZE)
    let anchorGridY = Math.round(iconY / GRID_SIZE)

    const start = initialPositions[draggingIconId]


    const deltaX = anchorGridX - start.gridX
    const deltaY = anchorGridY - start.gridY


    if (isNaN(anchorGridX) || isNaN(anchorGridY)) return

    // const occupied = new Set()

    // icons.forEach(icon => {
    //   if (!draggingRef.current.includes(icon.id)) {
    //     occupied.add(`${icon.gridX}-${icon.gridY}`)
    //   }
    // })

    // const finalUpdates = []

    // draggingPreview.forEach(u => {
    //   let { gridX, gridY } = u


    //   const maxCols = Math.floor((desktopSize.width - ICON_SIZE) / GRID_SIZE)
    //   const maxRows = Math.floor((desktopSize.height - ICON_SIZE) / GRID_SIZE)

    //   anchorGridX = Math.max(0, Math.min(anchorGridX, maxCols))
    //   anchorGridY = Math.max(0, Math.min(anchorGridY, maxRows))

    //   let key = `${gridX}-${gridY}`

    //   if (occupied.has(key)) {
    //     let found = false

    //     for (let dx = -2; dx <= 2 && !found; dx++) {
    //       for (let dy = -2; dy <= 2 && !found; dy++) {
    //         const nx = gridX + dx
    //         const ny = gridY + dy
    //         const newKey = `${nx}-${ny}`

    //         if (
    //           nx >= 0 && ny >= 0 &&
    //           nx <= maxCols && ny <= maxRows &&
    //           !occupied.has(newKey)
    //         ) {
    //           gridX = nx
    //           gridY = ny
    //           key = newKey
    //           found = true
    //         }
    //       }
    //     }

    //     if (!found) {return }
    //   }

    //   occupied.add(key)

    //   finalUpdates.push({
    //     id: u.id,
    //     gridX,
    //     gridY
    //   })

    // })

    const updates = []

    draggingRef.current.forEach(id => {
      const start = initialPositions[id]
      if (!start) return

      const newX = start.gridX + deltaX
      const newY = start.gridY + deltaY

      updates.push({
        id,
        gridX: newX,
        gridY: newY
      })
    })

    const finalUpdates = []

    const occupied = new Set()

    icons.forEach(icon => {
      if (!draggingRef.current.includes(icon.id)) {
        occupied.add(`${icon.gridX}-${icon.gridY}`)
      }
    })

    const maxCols = Math.floor((desktopSize.width - ICON_SIZE) / GRID_SIZE)
    const maxRows = Math.floor((desktopSize.height - ICON_SIZE) / GRID_SIZE)

    updates.forEach(u => {
      let { gridX, gridY } = u

      gridX = Math.max(0, Math.min(gridX, maxCols))
      gridY = Math.max(0, Math.min(gridY, maxRows))

      let key = `${gridX}-${gridY}`

      if (occupied.has(key)) {
        let found = false

        for (let dx = -2; dx <= 2 && !found; dx++) {
          for (let dy = -2; dy <= 2 && !found; dy++) {

            const nx = gridX + dx
            const ny = gridY + dy 

            const newKey = `${nx}-${ny}`

            if (
              nx >= 0 && ny >= 0 &&
              nx <= maxCols && ny <= maxRows &&
              !occupied.has(newKey)
            ) {
              gridX = nx
              gridY = ny
              key = newKey
              found = true
            }
          }
        }

        if (!found) return
      }

      occupied.add(key)

      finalUpdates.push({
        id: u.id,
        gridX,
        gridY
      })
    })

    setDraggingPreview(finalUpdates)
    setSnappedPreview(null)
  }

  const handleMouseUp = () => {

    if (isSelecting) {
      setIsSelecting(false)
      setSelectionBox(null)
      return
    }

    if (!draggingRef.current || !draggingPreview || draggingPreview.length === 0) return


    if (draggingPreview && draggingPreview.length > 0) {

      draggingPreview.forEach(u => {
        IconManager.updateIconPosition(u.id, u.gridX, u.gridY)

        StorageManager.updateItem(u.id, {
          gridX: u.gridX,
          gridY: u.gridY
        })
      })

      setIcons([...IconManager.getIcons()])
    }

    setDraggingPreview(null)
    setDraggingIds([])
    setDraggingIconId(null)
    draggingRef.current = null
    setSnappedPreview(null)
  }

  const [renamingId, setRenamingId] = useState(null)
  const [renameValue, setRenameValue] = useState("")

  useEffect(() => {

    const move = (e) => handleMouseMove(e)
    const up = (e) => handleMouseUp(e)

    window.addEventListener("mousemove", move)
    window.addEventListener("mouseup", up)

    return () => {
      window.removeEventListener("mousemove", move)
      window.removeEventListener("mouseup", up)
    }
  }, [draggingIconId, dragOffset, snappedPreview, isSelecting, selectionStart, selectionBox, selectedIcons, draggingPreview, draggingIds, initialPositions])

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

    setIcons([...IconManager.getIcons()])
  }, [])

  const handleRenameSubmit = () => {
    if (!renamingId) return

    const newName = renameValue.trim()
    if (!newName) return

    StorageManager.updateItem(renamingId, { name: newName })
    IconManager.renameIcon(renamingId, newName)

    setIcons([...IconManager.getIcons()])

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

      setIcons([...IconManager.getIcons()])

      setTimeout(() => {
        setRenamingId(id)
        setRenameValue(newItem.name)
      }, 0)
    }

    if (action === "delete") {
      if (!contextMenu.target) return

      const id = contextMenu.target.id

      StorageManager.removeItem(id)
      IconManager.deleteIcon(id)

      setIcons([...IconManager.getIcons()])
    }

    if (action === "rename") {
      if (!contextMenu.target) return

      const id = contextMenu.target.id

      setRenamingId(id)
      setRenameValue(contextMenu.target.name)

      setContextMenu(prev => ({ ...prev, visible: false }))
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

      setIcons([...IconManager.getIcons()])

      setTimeout(() => {
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


  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    type: null,
    target: null
  })
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false)

  const handleContextMenu = (e, target) => {
    e.preventDefault()

    setDraggingIconId(null)
    draggingRef.current = null
    setSnappedPreview(null)

    const type = target ? target.type : 'desktop'

    const menuWidth = 180
    const menuHeight = 16 + ((contextMenus[type]?.length || 0) * 40)

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
    setIsContextMenuOpen(true)
  }

  const onCloseContextMenu = () => {
    setContextMenu(prev => ({
      ...prev,
      visible: false
    }))
    setIsContextMenuOpen(false)
  }

  const onStartSelection = (e) => {

    if (isContextMenuOpen) return

    setIsSelecting(true)
    setSelectionStart({x: e.clientX, y: e.clientY})

    setSelectionBox({
      x: e.clientX,
      y: e.clientY,
      width: 0,
      height: 0
    })

    setSelectedIcons([])

  }

  return (
    <>
      <div className="h-screen w-screen overflow-hidden">
        <Desktop
          ref={desktopRef}
          onAction={handleDesktopAction}
          onContextMenu={handleContextMenu}
          onClick={onCloseContextMenu}
          onStartSelection={onStartSelection}
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
                width: `180px`,
                zIndex: 9999
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

            const preview = draggingPreview?.find(p => p.id === icon.id) 

            let gridX = preview ? preview.gridX : icon.gridX
            let gridY = preview ? preview.gridY : icon.gridY

            let x = gridX * GRID_SIZE + (GRID_SIZE - ICON_SIZE) / 2
            let y = gridY * GRID_SIZE + (GRID_SIZE - ICON_SIZE) / 2

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
                isSelected={selectedIcons.includes(icon.id)}
                onMouseDown={(e) => {
                  e.stopPropagation()
                  
                  if (e.ctrlKey) {
                    setSelectedIcons(prev => {
                      if (prev.includes(icon.id)) {
                        return prev.filter(id => id !== icon.id)
                      } else {
                        return [...prev, icon.id]
                      }
                    })
                    return
                  }

                  setSelectedIcons([icon.id])
                  handleMouseDown(icon.id, e)
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

          {selectionBox && isSelecting && (
            <div
              style={{
                position: "absolute",
                left: selectionBox.x,
                top: selectionBox.y,
                width: selectionBox.width,
                height: selectionBox.height,
                background: "rgba(0,120,255,0.2)",
                border: "1px solid rgba(0,120,255,0.8)",
                pointerEvents: "none",
                zIndex: 999
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