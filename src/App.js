import "./App.css";
import React, { useState, useRef, useEffect } from "react";
import { Routes, Link, Route, Navigate, useLocation } from "react-router-dom";
import { getItems, getRoot } from "./api";
//import Folder from './components/Folder';

//const dirName = window.location.pathname;

export function Folder() {
  const { pathname } = useLocation();
  const path = pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  const data = getItems(path);

  return (
    <div>
      <h1>{data.name}</h1>
      <ul>
        {data.items.map((item) => (
          <li key={item.name}>
            {item.type === "file" && (
              <>
                {item.name}, {item.size}
              </>
            )}
            {item.type === "dir" && (
              <>
                <Link to={path + "/" + item.name}>
                  {item.name}, {item.type}
                </Link>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function App() {
  const root = getRoot();

  return (
    <>
      <div>
        <h2>TeleBrowser</h2>
      </div>
      <hr />
      <Routes>
        <Route path="/" element={<Navigate to={root} />} />
        <Route path="/:path/*" element={<Folder />} />
      </Routes>
    </>
  );
}

export default App;
