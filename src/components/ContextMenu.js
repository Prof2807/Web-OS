

export default function ConextMenu() {

    return (
        <>
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
                <div onClick={() => handleAction("new-file")} className="p-2 hover:bg-gray-700 cursor-pointer">New File</div>
                <div onClick={() => handleAction("new-folder")} className="p-2 hover:bg-gray-700 cursor-pointer">New Folder</div>
                <div onClick={() => handleAction("open-terminal")} className="p-2 hover:bg-gray-700 cursor-pointer">Open Terminal</div>
                <div onClick={() => handleAction("change-wallpaper")} className="p-2 hover:bg-gray-700 cursor-pointer">Change Wallpaper</div>
            </div>
        </>
    )
}