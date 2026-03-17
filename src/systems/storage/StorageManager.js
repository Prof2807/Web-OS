let storage = {
    id: "root",
    type: "folder",
    name: "Desktop",
    children: []
}

const StorageManager = {

    addItem(parentId, item) {

        const parent = this.findItem(parentId)

        if (!parent || parent.type !== 'folder') { 
            console.log("Invalid parent"); 
            return false;
        }

        if (!parent.children) parent.children = []

        item.name = this.generateUniqueName(parent, item.name)

        parent.children.push(item)

        if (item.type === "folder" && !item.children) { item.children = [] }

        return true
        
    },

    generateUniqueName(parent, name) {

        if (!parent.children) return name

        const existingNames = parent.children.map(child => child.name)

        const baseName = name.replace(/\s*\(\d+\)$/, "")

        let newName = baseName
        let counter = 1

        while (existingNames.includes(newName)) {
            newName = `${baseName} (${counter})`
            counter++
        }

        return newName
    },

    removeItem(id) {
        return this._removeRecursive(storage, id)
    },

    _removeRecursive(node, id) {

        if (node.type !== "folder" || !node.children ) {
            return null
        }

        for (let i = 0; i < node.children.length; i++) {

            const child = node.children[i]

            if (child.id === id) {

                const removed = node.children.splice(i , 1)  

                return removed[0]
            }

            if (child.type === "folder") {
                const found = this._removeRecursive(child, id)
                if (found) return found
            }

        }

        return null

    },

    moveItem(itemId, newParentId) {

        const item = this.findItem(itemId)

        if (!item || itemId === 'root') return false

        const newParent = this.findItem(newParentId)

        if (!newParent || newParent.type !== "folder")
            return false

        if (itemId === newParentId)
            return false

        if (this._isDescendant(itemId, newParentId))
            return false

        const removed = this.removeItem(itemId)

        return this.addItem(newParentId, removed)
    },

    _searchDescendant(node, targetId) {

        if (!node.children || node.children.length === 0) return false

        for (let child of node.children) {

            if (child.id === targetId) return true

            if (child.type === "folder") {
                const found = this._searchDescendant(child, targetId)
                if (found) return true
            }

        }

        return false
    },

    _isDescendant(parentId, childId) {

        const parent = this.findItem(parentId)

        if (!parent || parent.type !== "folder") return false

        return this._searchDescendant(parent, childId)
    },

    findParent(id) {
        return this._findParentRecursive(storage, id)
    },

    _findParentRecursive(node, id) {

        if (node.type !== "folder" || !node.children) return null

        for (let child of node.children) {
            
            if (child.id === id) {
                return node
            }

            if (child.type === "folder") {
                let found = this._findParentRecursive(child, id)
                if (found) return found
            }

        }

        return null
    },

    findItem(id) {
        return this._findRecursive(storage, id)
    },

    _findRecursive(node, id) {

        if (node.id === id) {
            return node
        }

        if (node.type === "folder" && node.children) {
            for (let child of node.children) {

                let found = this._findRecursive(child, id)

                if (found) return found
            }
        }

        return null
    },

    updateItem(id, updates) {

        const item = this.findItem(id)

        if (!item) return false

        delete updates.id
        delete updates.type

        Object.assign(item, updates)

        return item

    },

    getChildren(parentId) {
        const parent = this.findItem(parentId)
        if (!parent || parent.type !== 'folder') return []
        return parent.children
    },

    getStorage() {
        return storage
    },
    
}

export default StorageManager