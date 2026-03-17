'use client'

import Wallpaper from "./Wallpaper"
import { useState , forwardRef } from "react"

import StorageManager from "@/systems/storage/StorageManager"

const Desktop = forwardRef(({ children , onMouseMove , onMouseUp, onAction}, ref) => {

  const handleLeftClick = (e) => {
    setMenu(prev => ({ ...prev, visible: false }))
  }

  const handleAction = (action) => {

    setMenu(prev => ({...prev, visible: false}))

    if (onAction) {
      onAction(action)
    } 

  }

  const handleRightClick = (e) => {
    e.preventDefault()

    const menuWidth = 180
    const menuHeight = 176

    let x = e.clientX
    let y = e.clientY

    if (x + menuWidth > window.innerWidth) { x = window.innerWidth - menuWidth }

    if (y + menuHeight > window.innerHeight) { y = window.innerHeight - menuHeight }

    setMenu({
        visible: true,
        x: x,
        y: y
    })
  }

  const [ menu , setMenu ] = useState({
    visible: false,
    x: 0,
    y: 0
  })

  return (
    <div
    ref={ref}
      onClick={handleLeftClick}
      onContextMenu={handleRightClick}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      style={{
        position: "relative",
        width: "100vw",
        height: "92vh",
        userSelect: "none"
      }}
    >
      <Wallpaper src="/Wallpaper.jpg" />

      {/* desktop content */}
      {children}

      {menu.visible && (
        <div
        style={{
            position: "absolute",
            top: menu.y,
            left: menu.x,
            background: "#222",
            color: "white",
            padding: "8px",
            borderRadius: "6px",
            width: "180px"
        }}
        >
        <div onClick={() => handleAction("new-file")} className="p-2 hover:bg-gray-700 cursor-pointer">New File</div>
        <div onClick={() => handleAction("new-folder")} className="p-2 hover:bg-gray-700 cursor-pointer">New Folder</div>
        <div onClick={() => handleAction("open-terminal")} className="p-2 hover:bg-gray-700 cursor-pointer">Open Terminal</div>
        <div onClick={() => handleAction("change-wallpaper")} className="p-2 hover:bg-gray-700 cursor-pointer">Change Wallpaper</div>
        </div>
    )}

    </div>
  )
})

export default Desktop