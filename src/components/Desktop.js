'use client'

import Wallpaper from "./Wallpaper"
import { useState , forwardRef } from "react"
import { contextMenus } from "@/systems/contextMenuConfig"
import ConextMenu from "./ContextMenu"

const Desktop = forwardRef(({ children , onMouseMove , onMouseUp, onAction, onContextMenu, onClick, onStartSelection}, ref) => {

  const handleLeftClick = (e) => {
    if (onClick) onClick()
  }

  const handleMouseDown = (e) => {
    if (e.button !== 0) return

    if (onStartSelection) {
      onStartSelection(e)
    }
  }

  const handleAction = (action) => {

    if (onAction) {
      onAction(action)
    } 

  }

  const handleRightClick = (e) => {
    e.preventDefault()

    if (onContextMenu) {
      onContextMenu(e, null)
    }
  }

  return (
    <div
    ref={ref}
      onClick={handleLeftClick}
      onContextMenu={handleRightClick}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseDown={handleMouseDown}
      style={{
        position: "relative",
        width: "100vw",
        height: "92vh",
        userSelect: "none"
      }}
    >
      <Wallpaper src="/Wallpaper.jpg" />

      {children}
    </div>
  )
})

export default Desktop