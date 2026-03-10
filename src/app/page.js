'use client'

import Desktop from "../components/Desktop"
import Dock from "../components/Dock"
import ShortcutIcon from "@/components/ShortcutIcon"

export default function Home() {

  return (
    <>
      <div className="h-screen w-screen">
        <Desktop>
          {/* desktop icons later */}
          {/* use public‑asset path; relative URL from root */}
          <ShortcutIcon icon="/file.svg" name="File Expsdaf ay udfodausadyf lorer" />
        </Desktop>

        <div className="h-[8vh]">
          <Dock />
        </div>
      </div>
    </>
  )
}