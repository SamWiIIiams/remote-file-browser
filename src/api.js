const directory = {
    name: "teleport",
    size: 0, // bytes
    type: "dir",
    items: [
        {
            name: "lib",
            size: 0, // bytes
            type: "dir",
            items: [
                {
                    name: "teleport.go",
                    size: 320000, // bytes
                    type: "file",
                },
                {
                    name: "test.go",
                    size: 3320000, // bytes
                    type: "file",
                },
                {
                    name: "new",
                    size: 0,
                    type: "dir",
                    items: [
                        {
                            name: "newThing",
                            size: 3423231,
                            type: "file"
                        }
                    ],
                },
            ],
        },
        {
            name: "README.md",
            size: 4340000, // bytes
            type: "file",
        },
        {
            name: "bin",
            size: 0, // bytes
            type: "dir",
            items: [
                {
                    name: "binFile.bin",
                    size: 2, // bytes
                    type: "file",
                    
                }
            ],
        },
    ],
};

  export function getItems(newPath) {
      if (newPath.endsWith('/')) {newPath = newPath.slice(0, -1)}
      console.log("new path = " + newPath);
     
          let pathArray = newPath.split("/")
          pathArray.shift();
          console.log(pathArray)
          let search = directory;
          for (let i = 1; i < pathArray.length; i++) {
              search = search.items.find(item => item.name === pathArray[i]);
          }

          return search;
      
  }
  export function getRoot() {
  }

  