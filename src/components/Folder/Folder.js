import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder } from '@fortawesome/free-solid-svg-icons';
import { faFile } from '@fortawesome/free-regular-svg-icons';
import { getItems } from '../../api';
import "./Folder.css";


export default function Folder() {
  const { pathname } = useLocation();
  const path = pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  const { name, items } = getItems(path);
  const [data, setData] = useState([]);
  const [sortType, setSortType] = useState({value: "name", order: true});
  const [searchValue, setSearchValue] = useState([]);

  useEffect(() => {
    setData(items);
  },[path]);

  useEffect(() => {
    const searchArray = (searchValue) => {
      console.log("searching on: " + searchValue);
      const searchOn = searchValue;
      const searched = [...items].filter((entry) => entry.name.toLowerCase().includes(searchOn));
      setData(searched);
    }
    searchArray(searchValue);
  }, [searchValue]);
  
  useEffect(() => {
    const sortArray = ({ value, order }) => {
      const types = {
        name: "name",
        type: "type",
        size: "size"
      };
      const sortProperty = types[value];
      let sorted;
      if (sortProperty === 'size') {
        if (order) {
          sorted = [...items].sort((a, b) => b[sortProperty] - a[sortProperty]);
        } else {
          sorted = [...items].sort((a, b) => a[sortProperty] - b[sortProperty]);
        }
      } else {
        if (order) {
          sorted = [...items].sort((a, b) => {
            const thingA = a[sortProperty].toUpperCase();
            const thingB = b[sortProperty].toUpperCase();
            if (thingA < thingB) { return -1;}
            if (thingA > thingB) { return 1;}
            return 0;
          });
        } else {
          sorted = [...items].sort((a, b) => {
            const thingA = a[sortProperty].toUpperCase();
            const thingB = b[sortProperty].toUpperCase();
            if (thingA < thingB) { return 1; }
            if (thingA > thingB) { return -1; }
            return 0;
          });
        }
      }
      setData(sorted);
    };

    sortArray(sortType);
  }, [sortType]);

  

  return (
    <>
      <h1>{name}</h1>
      <label htmlFor="searchBar">Search directory</label>
      <input type="text" id="searchBar" name="searchBar" onChange={(e) => setSearchValue(e.target.value.toLowerCase())}></input>
      <div className='Box mb-3'>
        <div className='Box-header position-relative'>
          <span>
            <button onClick={() =>setSortType({...sortType, value: "name", order: !sortType.order})}>name</button>
            <button onClick={() =>setSortType({...sortType, value: "type", order: !sortType.order})}>type</button>
            <button onClick={() =>setSortType({...sortType, value: "size", order: !sortType.order})}>size</button>
          </span>
        </div>
        <div >
          {data.map((file, idx) => (
            <div key={idx} className="Box-row py-2 d-flex position-relative">
              {file.type === "file" && (
                <>
                    <FontAwesomeIcon icon={faFile} className="file-icon" />
                    <div className='flex-auto min-width-0 mr-3'>{file.name}</div>
                    <div className='flex-auto min-width-0 mr-3 col-5 d-md-block'></div>
                    <div className='text-right'>{file.size}</div>
                  
                </>
              )}
              {file.type === "dir" && (
                <>
                  <FontAwesomeIcon icon={faFolder} className="folder-icon"/>
                  <Link to={path + "/" + file.name}>
                    <span>{file.name}</span>
                  </Link>
                  <div className='flex-auto min-width-0 mr-3 col-5 d-md-block'></div>
                  <div className='text-right'>{file.size}</div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}