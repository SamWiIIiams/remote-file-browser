const fs = require('fs');
const joinPath = require('path');

const root = './teleport';


const validatePath = (user_input) => {
    if (user_input.indexOf("\0") !== -1) {
      return "Access denied";
    } 
    if (user_input.indexOf('..') !== -1) {
      return "Access denied";
    }
    var safe_input = joinPath
      .normalize(user_input)
      .replace(/^(\.\.(\/|\\|$))+/, "");
    // stripping 'directories' from path
    safe_input = safe_input.replace(/directories/, '');
    var path_string = joinPath.join(root, safe_input);
    return path_string;

}

function getDetails(path, file, id) {
  newPath = joinPath.join(path, file);
  return new Promise((resolve, reject) => {
    fs.stat(newPath, (err, stats) => {
      if (err) throw err;
      const type = stats.isDirectory() ? "dir" : "file";
      resolve(
        err
          ? "not found in path"
          : (type === "dir" ? {
              name: file,
              type: type,
              size: 0,
              id: id,
            } : {
              name: file,
              type: type,
              size: stats.size,
              id: id,
            }
          )
      );
    });
  });
}

function getDirectory(path) {
  //removing name of root folder
  path = path.substring(path.indexOf('/') + 1) //slash direction will need to change in docker
  path = path.endsWith('/') ? path.slice(0, -1) : path;
  return '/' + path
}

module.exports = { validatePath, getDetails, getDirectory }