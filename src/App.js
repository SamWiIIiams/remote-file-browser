import './App.css';
import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolder } from '@fortawesome/free-solid-svg-icons'
import { v4 as uuidv4 } from 'uuid'

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
        ],
      },
      {
        name: "README.md",
        size: 4340000, // bytes
        type: "file",
      },
    ],
  };

function App() {
    

  return (
    <div>
        <ul>
            {directory.items.find(item => item.name === "lib").items.map((item, idx) =>
                <li key={idx}>
                    <div><FontAwesomeIcon icon={faFolder}/> {item.name}</div>
                    <div class="itemSize">{item.size}</div>
                </li>
            )}
        </ul>
    </div>
  )
}

export default App;
