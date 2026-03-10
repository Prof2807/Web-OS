'use client'

import { DockIcon } from "./DockIcon"

export default function Dock() {
  return (
    <div className="bg-taskbar flex w-full justify-center align-center h-full"
    onContextMenu={(e) => e.preventDefault()}
    >
      <DockIcon icon="/globe.svg" name="Browser" />
      <DockIcon icon="/file.svg" name="File Explorer" />
      <DockIcon icon="/next.svg" name="Next App" />
      <DockIcon icon="/window.svg" name="Window" />
      <DockIcon icon="/vercel.svg" name="Vercel" />
    </div>
  )
}