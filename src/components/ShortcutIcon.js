'use client'

import { useState , useEffect } from "react"

export default function ShortcutIcon({ icon, name, x, y, size, onMouseDown, onContextMenu, isRenaming, renameValue, setRenameValue, onRenameSubmit }) {

  return (
    <div
      onMouseDown={onMouseDown}
      onContextMenu={onContextMenu}
      className="flex flex-col items-center justify-center"
      style={{
        position: "absolute",
        top: y ?? 0,
        left: x ?? 0,
        width: size,
        height: size
      }}
    >
      {/* limit the icon height so the label isn’t covered */}
      <img
        src={icon}
        alt={name}
        className="h-3/4 w-auto"
        draggable="false"
      />
      {/* label below the image; full width ensures truncate works */}
      
      {isRenaming ? (
        <input
          autoFocus
          value={renameValue}
          onChange={(e) => setRenameValue(e.target.value)}
          onBlur={onRenameSubmit}
          onKeyDown={(e) => {
            if (e.key === "Enter") onRenameSubmit()
          }}
          onMouseDown={(e) => e.stopPropagation()}
          style={{
            width: "100%",
            textAlign: "center"
          }}
        />
      ) : (
        <span className="text-xs text-white block w-full truncate whitespace-nowrap mt-1 text-center text-border:-1 text-border-gray-800">
        {name}
      </span>
      )}
    </div>
  )
}