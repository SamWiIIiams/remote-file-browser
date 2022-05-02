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
      <h1>/{name}</h1>
      <label htmlFor="searchBar">Search directory</label>
      <input type="text" id="searchBar" name="searchBar" onChange={(e) => setSearchValue(e.target.value.toLowerCase())}></input>
      <div className='Box mb-3'>
        <div className='Box-header'>
          <div className="spacer"></div>
          <div className="sort-name hover" onClick={() =>setSortType({...sortType, value: "name", order: !sortType.order})}>name</div>
          <div className="small-name hover" onClick={() =>setSortType({...sortType, value: "name", order: !sortType.order})}>name</div>
          <div className="sort-type hover" onClick={() =>setSortType({...sortType, value: "type", order: !sortType.order})}>type</div>
          <div className="sort-size hover" onClick={() =>setSortType({...sortType, value: "size", order: !sortType.order})}>size</div>
        </div>
        <div >
          {data.map((file, idx) => (
            <div key={idx} className="Box-row py-2 d-flex position-relative">
              {file.type === "file" && (
                <>
                    <FontAwesomeIcon icon={faFile} className="file-icon" />
                    <div className='item-name'>{file.name}</div>
                    <div className='item-type '>{file.type}</div>
                    <div className='item-size'>{file.size}</div>
                  
                </>
              )}
              {file.type === "dir" && (
                <>
                  <FontAwesomeIcon icon={faFolder} className="folder-icon"/>
                  <Link className='item-name router-link' to={path + "/" + file.name}>
                    {file.name}
                  </Link>
                  <div className='item-type'>{file.type}</div>
                  <div className='item-size'>{file.size}</div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}