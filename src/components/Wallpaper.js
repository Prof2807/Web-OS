'use client'
import Image from "next/image"

export default function Wallpaper({ src }) {
  return (
    <Image
      src={src}
      alt="desktop wallpaper"
      fill
      style={{
        objectFit: "cover",
        pointerEvents: "none",
        zIndex: -1, // keep wallpaper behind any desktop children
        userSelect: "none"
      }}
    />
  )
}