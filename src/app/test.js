import StorageManager from "../systems/storage/StorageManager.js"

StorageManager.addItem("root", {
  id: "folder1",
  type: "folder",
  name: "Games"
})

StorageManager.addItem("folder1", {
  id: "folder2",
  type: "folder",
  name: "Imp"
})

StorageManager.addItem("folder2", {
  id: "folder3",
  type: "file",
  name: "game"
})

console.log(StorageManager.findParent('folder2'));