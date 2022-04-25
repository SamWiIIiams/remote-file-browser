import './App.css';
import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Link, Route, Navigate, useParams } from 'react-router-dom'
import { getItems } from './api';
//import Folder from './components/Folder';



export function Folder() {
  const { dirName } = useParams();
  const {name, items} = getItems(dirName);
  return (
    <div>
      <h1>{name}</h1>
        <ul>
          {items.filter((dir) => dir.type ==="dir").map(({ name, type }) => (
            <li key={name}>
              <Link to={name}>{name}, {type}</Link>
            </li>
          ))}
        </ul>
        {/* <ul>
          {items.filter((file) => file.type ==="file").map(({ size, name }) =>
            <li key={name}>
              {name}, {size}
            </li>
          )}
        </ul> */}
        <Routes>
          <Route path={`:dirName/*`} element={<Folder />} />
        </Routes>
    </div>
  );
};


function App() {
    

  return (
    <Router>
      <div>
        <h2>TeleBrowser</h2>
      </div>
      <hr/>
      <Routes>
        <Route path="/" element={<Navigate to="/teleport" />} />
        <Route path="/:dirName/*" element={<Folder />} />
      </Routes>
    </Router>
  );
}

export default App;
