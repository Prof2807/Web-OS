
let icons = []

const IconManager = {

    createIcon(iconData) {
        const icon = {
            id: crypto.randomUUID(),
            name: iconData.name,
            type: iconData.type,
            iconPath: iconData.iconPath,
            gridX: iconData.gridX,
            gridY: iconData.gridY
        }
        if (this.isCellOccupied(icon.gridX, icon.gridY)) {
            const newCoords = this.findNextFreeCell(icon.gridX,icon.gridY)
            icon.gridX = newCoords.gridX
            icon.gridY = newCoords.gridY
        }

        icons.push(icon)
    },

    deleteIcon(id) {
        const exits = icons.some(icon => icon.id === id)
        if (!exits) return false
        
        icons = icons.filter(icon => icon.id !== id)
        return true
    },

    renameIcon(id, newName) {
        const icon = icons.find(i => i.id === id)
        if (!icon) return false

        if (typeof newName !== "string" || newName.trim() === "") return false

        icon.name = newName.trim()
        return true
    },

    findNextFreeCell(startX, startY) {
        const GRID_COLS = 16
        const GRID_ROWS = 7

        for (let x = startX; x < GRID_COLS; x++) {
            for (let y = (x === startX ? startY : 0); y < GRID_ROWS; y++) {

                if (!this.isCellOccupied(x, y)) {
                    return { gridX: x, gridY: y }
                }

            }
        }
        throw new Error("No free cell found.")
    },

    updateIconPosition(id, gridX, gridY) {
        const icon = icons.find(icon => icon.id === id)

        if (!icon) return

        if (this.isCellOccupied(gridX, gridY)) {
            const next  = this.findNextFreeCell(gridX, gridY)
            icon.gridX = next.gridX
            icon.gridY = next.gridY
        } else {
            icon.gridX = gridX
            icon.gridY = gridY
        }
    },

    isCellOccupied( x , y ) {
        return icons.some(icon => icon.gridX === x && icon.gridY === y)
    },
    
    getIcons() {
        return [...icons]
    }

}

export default IconManager