import React from 'react'
import { Link, useLocation } from 'react-router-dom';
import { getItems } from '../api';


export default function Folder() {
  const { pathname } = useLocation();
  const path = pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  const data = getItems(path);
  let sortOn = "name";

  function sortBy(sort) {
    sortOn = sort;
  }

  return (
    <>
      <h1>{data.name}</h1>
      <span>
        <button onClick={sortBy('name')}>name</button>
        <button onClick={sortBy('type')}>type</button>
        <button onClick={sortBy('size')}>size</button>
        sorting on {sortBy}
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