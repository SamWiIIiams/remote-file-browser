const directory = [{
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
                    ]
                },
            ],
        },
        {
            name: "README.md",
            size: 4340000, // bytes
            type: "file",
        },
    ],
}];

  export function getItems(newPath) {
      console.log("new path = " + newPath);
      if (newPath) {
          let path = window.location.pathname.split('/');
          path.shift();
          path.pop();
          path.push(newPath);
          console.log(path)
          let search = directory.find(item => item.name === path[0]);
          for (let i = 1; i < path.length; i++) {
              search = search.items.find(item => item.name === path[i]);
          }

          return search;
      } return directory.find(item => item.name === "teleport")
  }

  