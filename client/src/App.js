import './App.css';
import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Folder, Login } from "./components";


function App() {
  const [loginStatus, setLoginStatus] = useState(false);
  const [pageLoad, setPageLoad] = useState(false);

  const logout = () => {
    fetch("http://localhost:8080/logout", {
      method: 'DELETE',
      'credentials': 'include',
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(response => {
      if (response.status === 200) {
        setLoginStatus(false);
      }
    })
  }

  return (
    <div className="app-wrapper">
      <div className='box-app-header'>
        <h2>TeleBrowser</h2>
        {loginStatus && 
        <button className="logout-button" onClick={() => logout()}>Logout</button>
        }
      </div>
      <hr />
      {(!loginStatus && pageLoad) ? 
        <Login setPageLoad={setPageLoad} setLoginStatus={setLoginStatus}/>
      : 
      <Routes>
        <Route path="/" element={<Navigate to="directories" />} />
        <Route path="/directories/*" element={<Folder pageLoad={pageLoad} setPageLoad={setPageLoad} setLoginStatus={setLoginStatus}/>} />
        <Route path="/directories/:path/*" element={<Folder pageLoad={pageLoad} setPageLoad={setPageLoad} setLoginStatus={setLoginStatus}/>} />
      </Routes>
      }
    </div>
  );
}

export default App;
