"use client"
import React, { useState, useRef } from "react"

export const DockIcon = ({ icon, name }) => {
  const [showTooltip, setShowTooltip] = useState(false)
  const timerRef = useRef(null)

  const handleMouseEnter = () => {
    // start timer when cursor enters the area (button or tooltip)
    timerRef.current = setTimeout(() => {
      setShowTooltip(true)
    }, 500) 
  }

  const handleMouseLeave = () => {
    // clear pending timer and hide tooltip when cursor leaves entire wrapper
    clearTimeout(timerRef.current)
    setShowTooltip(false)
  }

  // clean up timeout on unmount to avoid memory leaks
  React.useEffect(() => {
    return () => clearTimeout(timerRef.current)
  }, [])

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className="h-full aspect-square flex items-center justify-center hover:bg-gray-800"
        onMouseDown={(e) => {
          // distinguish left/middle/right using if/else-if chain
          if (e.button === 0) {
            console.log("Left Mouse Event")
          } else if (e.button === 1) {
            console.log("Middle Mouse Event")
          } else if (e.button === 2) {
            console.log("Right Mouse Event")
          }}}
        onContextMenu={(e) => e.preventDefault()} // also prevent menu on button
      >
        <img src={icon} alt={name} height={30} width={30} draggable={false}/>
      </button>

      {showTooltip && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 
                         whitespace-nowrap bg-black text-white text-xs 
                         px-2 py-1 rounded shadow-lg">
          {name}
        </span>
      )}
    </div>
  )
}