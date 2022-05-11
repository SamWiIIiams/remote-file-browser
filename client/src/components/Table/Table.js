import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faAngleDown, faAngleUp, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { faFile } from '@fortawesome/free-regular-svg-icons';
import "./Table.css"

const sortArray = ({ value, order }, data) => {
    const types = {
      name: "name",
      type: "type",
      size: "size"
    };
    const sortProperty = types[value];
    let sorted;
    if (sortProperty === 'size') {
      if (order === "asc") {
        sorted = [...data].sort((a, b) => a[sortProperty] - b[sortProperty]);
      } else {
        sorted = [...data].sort((a, b) => b[sortProperty] - a[sortProperty]);
      }
    } else {
      if (order === "asc") {
        sorted = [...data].sort((a, b) => {
          const thingA = a[sortProperty].toUpperCase();
          const thingB = b[sortProperty].toUpperCase();
          if (thingA < thingB) { return -1;}
          if (thingA > thingB) { return 1;}
          return 0;
        });
      } else {
        sorted = [...data].sort((a, b) => {
          const thingA = a[sortProperty].toUpperCase();
          const thingB = b[sortProperty].toUpperCase();
          if (thingA < thingB) { return 1; }
          if (thingA > thingB) { return -1; }
          return 0;
        });
      }
    }
    return sorted;
  };

function humanFileSize(bytes) {

  if (Math.abs(bytes) < 1000) {
    return bytes + ' B';
  }

  const units = ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] 
  let u = -1;
  const r = 10;

  do {
    bytes /= 1000;
    ++u;
  } while (Math.round(Math.abs(bytes) * r) / r >= 1000 && u < units.length - 1);


  return bytes.toFixed(1) + ' ' + units[u];
}

function Table(props) {
  const cleanRoute = props.pathname.endsWith("/") ? props.pathname : props.pathname + "/";
  const upFolder = parseUpFolder();
  //const [upFolder, setUpFolder] = useState("/");
  const [data, setData] = useState([]);
  const [sortType, setSortType] = useState({ value: "type", order: "asc" });
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    setSortType({ value: "type", order: "asc" });
    //setUpFolder(parseUpFolder())
  },[])

  useEffect(() => {
    setData(sortArray(sortType, props.data));
  }, [sortType.order, sortType.value, props.data]);

  useEffect(() => {
    const searchArray = (searchValue) => {
      console.log("searching on: " + searchValue);
      const searchOn = searchValue;
      const searched = props.data
        ? [...props.data].filter((entry) =>
            entry.name.toLowerCase().includes(searchOn)
          )
        : "";
      setData(sortArray(sortType, searched));
    };
    searchArray(searchValue);
  }, [searchValue]);

  function parseUpFolder() {
    if (cleanRoute === "/") {
      return cleanRoute;
    }
    let upPath = cleanRoute.slice(0, -1);
    upPath = upPath.substring(0, upPath.lastIndexOf('/'));
    return upPath
  }

  return (
    <>
      <div data-testid="dir-table" className="search-dir">
        <div className="dir-name">{props.pathname}</div>
        <input
          type="text"
          className="search"
          placeholder="Search directory"
          onChange={(e) => setSearchValue(e.target.value.toLowerCase())}
        ></input>
      </div>
      <div className="Box mb-3">
        <div className="Box-header d-flex">
          {upFolder === "/" ? 
            <div className="spacer">
              <FontAwesomeIcon icon={faArrowUp} className="top-folder"/>
            </div> : 
            <Link to={"/directories" + upFolder} className="spacer">
              {/* <div className="spacer"> */}
                <FontAwesomeIcon icon={faArrowUp} className="up-folder" />
              {/* </div> */}
            </Link>
          }
          <div
            className="sort-name hover d-flex"
            onClick={() =>
              setSortType(sortType.value === "name" && sortType.order === "asc" ? { value: "name", order: "desc" } : {value: "name", order: "asc"})
            }
          >
          {sortType.value ==="name" && (sortType.order === "asc" ? <FontAwesomeIcon icon={faAngleUp} className="asc-icon" /> : <FontAwesomeIcon icon={faAngleDown} className="asc-icon" />)} name
          </div>
          <div
            className="sort-type hover"
            onClick={() =>
              setSortType(sortType.value === "type" && sortType.order === "asc" ? { value: "type", order: "desc" } : {value: "type", order: "asc"})
            }
          >
            {sortType.value ==="type" && (sortType.order === "asc" ? <FontAwesomeIcon icon={faAngleUp} className="asc-icon" /> : <FontAwesomeIcon icon={faAngleDown} className="asc-icon" />)} type
          </div>
          <div
            className="sort-size hover"
            onClick={() =>
              setSortType(sortType.value === "size" && sortType.order === "asc" ? { value: "size", order: "desc" } : {value: "size", order: "asc"})
            }
          >
            {sortType.value ==="size" && (sortType.order === "asc" ? <FontAwesomeIcon icon={faAngleUp} className="asc-icon" /> : <FontAwesomeIcon icon={faAngleDown} className="asc-icon" />)} size
          </div>
        </div>
        <div>
          {data.map((file, idx) => (
            <div key={idx} className="Box-row py-2 d-flex position-relative">
              {file.type === "file" && (
                <>
                  <FontAwesomeIcon icon={faFile} className="file-icon" />
                  <div className="item-name">{file.name}</div>
                  <div className="item-type ">{file.type}</div>
                  <div className="item-size">{humanFileSize(file.size)}</div>
                </>
              )}
              {file.type === "dir" && (
                <>
                  <FontAwesomeIcon icon={faFolder} className="folder-icon" />
                  <Link
                    className="item-name router-link"
                    to={"/directories" + cleanRoute + file.name}>
                    {file.name}
                  </Link>
                  <div className="item-type">{file.type}</div>
                  <div className="item-size"></div>
                </>
              )}
            </div>
          ))}
        </div>
          {data.length === 0 && 
          <div className='empty-folder d-flex'>
            <div>Nothing here</div>
          </div>
          }
          <div className='footer'></div>
      </div>
    </>
  );
}

export default Table