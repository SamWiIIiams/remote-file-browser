

const db = {
  credentials: [
    {
      username: "SamWilliams",
      password: "goTeleport123",
    },
    {
      username: "zbm3",
      password: "goTeleport123",
    },
    {
      username: "hatched",
      password: "goTeleport123",
    },
    {
      username: "ibeckermayer",
      password: "goTeleport123",
    },
    {
      username: "pierrebeaucamp",
      password: "goTeleport123",
    },
  ]
};


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
              name: "newThingsuperduperlongfilenameeeeeeeeeeeeeeeeee",
              size: 3423231,
              type: "file",
            },
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
          name: "binfile.md",
          size: 439798, // bytes
          type: "file",
        },
      ],
    },
  ],
};

export function getItems(newPath) {
  if (newPath.endsWith("/")) {
    newPath = newPath.slice(0, -1);
  }
  console.log("new path = " + newPath);

  let pathArray = newPath.split("/");
  pathArray.shift();
  console.log(pathArray);
  let search = directory;
  for (let i = 1; i < pathArray.length; i++) {
    search = search.items
      .filter((dir) => dir.type === "dir")
      .find((item) => item.name === pathArray[i]);
  }

  return search;
}
export function getRoot() {
  return "/" + directory.name;
}

export function getData(url) {}
