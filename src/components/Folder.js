import React, {useState, useEffect} from 'react'
import { Link, useLocation } from 'react-router-dom';
import { getItems } from '../api';


export function Folder() {
  const { pathname } = useLocation();
  const path = pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  const { name, items } = getItems(path);
  const [data, setData] = useState([]);
 
  const [sortType, setSortType] = useState({value: "name", order: true});

  useEffect(() => {
    setData(items);
  },[path])
  
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
      <span>
        <button onClick={() =>setSortType({...sortType, value: "name", order: !sortType.order})}>name</button>
        <button onClick={() =>setSortType({...sortType, value: "type", order: !sortType.order})}>type</button>
        <button onClick={() =>setSortType({...sortType, value: "size", order: !sortType.order})}>size</button>
      </span>
      <ul>
        {data.map(file => (
          <li key={file.name}>
            {file.type === "file" && (
              <>
                <span>{file.name}, {file.size}</span>
              </>
            )}
            {file.type === "dir" && (
              <>
                <Link to={path + "/" + file.name}>
                  <span>{file.name}, {file.type}</span>
                </Link>
              </>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}