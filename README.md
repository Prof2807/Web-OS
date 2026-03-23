# Web-OS
This project is made with a intention of replicating the functions of a basic operating system. This will help me learn more about things that we take granted. This just replicates   operating system UI like:
    1. Desktop
    2. Icons
    3. Context Menu

Fetures (Until Now):
  1. Desktop Enviroment:
    - Click and Interaction Handling
    - Drag support
  2. Icon System:
    - Dynamic Shortcut Rendering
    - Managed via centralised icon manager
    - Prevent Duplicate Naming
    - Overlapping proof
  3. Context Menu:     
    - Right Click menus for desktop, folder and files
    - Config Driven
    - Prevent placing icons outside desktop
  5. File System:
    - Folder and file structure
    - Add and remove Item
    - Nested Hierachy ( Can be used to give file location like normal os )
    - Connected with IconManager 

---

# Tech Stack:
  1. Next.js
  2. Tailwind

---

```
{
  /components
    Desktop.js
    ShortcuteIcon.js
    Wallpaper.js
    ContextMenu.js
    Dock.js
    DocIcon.js

  /systems
    IconManager.js
    contextMenuConfig.js
    StorageManager.js
}
```

---

## File System Logic:

File system consists of one root which have children and other folders will also have children
For example:

```
{
{
id,
name="root",
type="folder",
children=[
{
id="folder1",
name="study material",
type="folder",
children=[ {id, name="Material", type="Video"} ]
}
]
}
}
```

---

# Note: This project is under development!!

# Future goals:
  1. Window support: Like when we click a app it open a window
  2. Working Apps: Like notepad, game
  3. Custom language: A js dialect kind of

---

# Getting Started:

```
{
  git clone https://github.com/Prof2807/Web-OS
  cd Web-OS
  npm install
  npm run dev
}
```



