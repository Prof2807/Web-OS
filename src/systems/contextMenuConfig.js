export const contextMenus = {
  desktop: [
    { label: "New Folder", action: "new-folder" },
    { label: "New File", action: "new-file" },
    { label: "Open Terminal", action: "open-terminal" },
    { label: "Change Wallpaper", action: "change-wallpaper" }
  ],

  file: [
    { label: "Open", action: "open" },
    { label: "Rename", action: "rename" },
    { label: "Delete", action: "delete" }
  ],

  folder: [
    { label: "Open", action: "open" },
    { label: "Rename", action: "rename" },
    { label: "Delete", action: "delete" }
  ],

  app: [
    { label: "Open", action: "open" },
    { label: "Pin to Dock", action: "pin" }
  ]
}