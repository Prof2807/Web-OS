'use client'

export default function ShortcutIcon({ icon, name }) {
  return (
    <div
      draggable="true"
      className=" max-h-[4.8vw] aspect-square flex flex-col items-center justify-center"
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