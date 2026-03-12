'use client'

import { useState , useEffect } from "react"

export default function ShortcutIcon({ icon, name, x, y, onMouseDown }) {

  return (
    <div
      onMouseDown={(e) => {onMouseDown(name , e)}}
      className=" max-h-[4.8vw] aspect-square flex flex-col items-center justify-center"
      style={{
        position: "absolute",
        top: y ?? 0,
        left: x ?? 0
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
      <span className="text-xs text-white block w-full truncate whitespace-nowrap mt-1 text-border:-1 text-border-gray-800">
        {name}
      </span>
    </div>
  )
}