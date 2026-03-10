'use client'

import Wallpaper from "./Wallpaper"
import { useState } from "react"

export default function Desktop({ children }) {

  const handleLeftClick = (e) => {
    console.log("LMB", e.clientX, e.clientY)
    setMenu(prev => ({ ...prev, visible: false }))
  }

  const handleRightClick = (e) => {
    e.preventDefault()
    setMenu({
        visible: true,
        x: e.clientX,
        y: e.clientY
    })
    console.log("RMB", e.clientX, e.clientY)
  }

  const [ menu , setMenu ] = useState({
    visible: false,
    x: 0,
    y: 0
  })

  return (
    <div
      onClick={handleLeftClick}
      onContextMenu={handleRightClick}
      style={{
        position: "relative",
        width: "100vw",
        height: "92vh"
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
        <div className="p-2 hover:bg-gray-700 cursor-pointer">New File</div>
        <div className="p-2 hover:bg-gray-700 cursor-pointer">New Folder</div>
        <div className="p-2 hover:bg-gray-700 cursor-pointer">Open Terminal</div>
        <div className="p-2 hover:bg-gray-700 cursor-pointer">Change Wallpaper</div>
        </div>
    )}

    </div>
  )
}