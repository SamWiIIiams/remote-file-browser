import React, { useState } from 'react'
import './login.css'

function Login({ setPageLoad, setLoginStatus }) {
  const [uname, setUsername] = useState();
  const [pword, setPassword] = useState();
  const [message, setMessage] = useState("");
  
  const login = () => {
    if (pword && uname) {
      fetch("http://localhost:8080/login", {
        method: 'POST',
        'credentials': 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: uname,
          password: pword,
        })
      }).then(response => response.json())
      .then(response => {
        if (response.loggedIn) {
          console.log(response.message);
          setLoginStatus(true)
          setPageLoad(false)
        } else {
          console.log(response.message);
          setMessage(response.message);
        }
      }).catch((error) => {
        console.error('error: ' + error);
      })
    } else {
      setMessage("Please enter both a username & password.");
    }
  }


  return (
    <>
      <div className='login'>
        <div className="login-input">
          <h1>Please Login</h1>
        </div>
        <div className="login-input">
          <input type="text" placeholder="Username..." onChange={(e) => setUsername(e.target.value)}/>
        </div>
        <div className="login-input">
          <input type="password" placeholder="password..." onChange={(e) => setPassword(e.target.value)}/>
        </div>
        <button className="login-button" onClick={() => login()}>Login</button>
        <div>{message}</div>
      </div>
    </>
  )
}

export default Login