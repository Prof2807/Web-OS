'use client'

import Desktop from "../components/Desktop"
import Dock from "../components/Dock"

export default function Home() {

  return (
    <>
      <div className="h-screen w-screen">
        <Desktop>
          {/* desktop icons later */}
        </Desktop>

        <div className="h-[8vh]">
          <Dock />
        </div>
      </div>
    </>
  )
}