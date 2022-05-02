import "./App.css";
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { getRoot } from "./api";
import { Folder } from "./components";


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
