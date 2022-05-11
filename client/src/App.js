import "./App.css";
import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { getRoot } from "./api";
import { Folder, Login } from "./components";


function App() {
  const root = getRoot();
  const [loginStatus, setLoginStatus] = useState();
  const [pageLoad, setPageLoad] = useState(false);



  useEffect(() => {
    fetch("http://localhost:5000/login", {
      method: 'GET',
      'credentials': 'include',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    }).then(response => response.json())
    .then(response => {
      if (response.loggedIn) {
        setLoginStatus(true);
      }
      console.log(response.error)
      setPageLoad(true)
    }).catch((error) => {
      console.error('error: ' + error);
      setPageLoad(true)
    })
  },[])


  return (
    <div className="app-wrapper">
      <div>
        <h2>TeleBrowser</h2>
      </div>
      <hr />
      {(!loginStatus && pageLoad) ? 
        <Login setLoginStatus={setLoginStatus}/>
      : (loginStatus && pageLoad) ? 
      <Routes>
        <Route path="/" element={<Navigate to={root} />} />
        <Route path="/:path/*" element={<Folder />} />
      </Routes>
      : <div>loading</div>}
    </div>
  );
}

export default App;
