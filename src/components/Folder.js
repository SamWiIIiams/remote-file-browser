import React, {useState, useEffect} from 'react'
import { Link, useLocation } from 'react-router-dom';
import { getItems } from '../api';


export default function Folder() {
  const { pathname } = useLocation();
  const path = pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  const data = getItems(path);
  const [data2, sortData] = useState([]);

  const sortEntries = property => {
    const properties = {
      name: 'name',
      type: 'type',
      size: 'size',
    };
    const sortProperty = properties[property];
    const sorted = data.sort((a, b) => b[sortProperty] - a[sortProperty]);
    console.log(sorted);
    sortData(sorted);

  } 

    

  return (
    <>
      <h1>{data.name}</h1>
      <span>
        <button onClick={sortEntries('name')}>name</button>
        <button onClick={sortEntries('type')}>type</button>
        <button onClick={sortEntries('size')}>size</button>
      </span>
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
    </>
  );
}