import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import { NotFound } from '../NotFound'
import "./Folder.css";
import { Table } from '../Table';


export default function Folder({ pageLoad, setPageLoad, setLoginStatus }) {
  const { pathname } = useLocation();
  //const [pageLoad, setPageLoad] = useState()
  const [dirExists, setDirExists] = useState(true);
  const [data, setData] = useState([]);

  


  useEffect(() => {
    fetch("http://localhost:8080/directory", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({ path: pathname }),
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json()
        } else {
          throw (
            {
              message: "Failed to retrieve data: ",
              status: response.status
            }
          )
        }
      }).then((body) => {
        setData(body.files);
        setPageLoad(true);
        setLoginStatus(true);
      })
      .catch((error) => {
        if (error.status === 401) {
          console.log(error.message + error.status)
          setLoginStatus(false);
          setPageLoad(true);
        } else {
          setLoginStatus(true);
          setDirExists(false);
          setPageLoad(true);
        }
      });
  },[pathname])

  
  if (!dirExists) {
    return <NotFound />
  } else if (pageLoad) {
    return <Table pathname={data.name} data={data.result} />
  } else {
    return <div>Loading...</div>
  }
}