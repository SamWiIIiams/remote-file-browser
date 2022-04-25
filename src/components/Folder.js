import React from 'react'
import { Routes, Route, Link, useParams } from 'react-router-dom';
import { getItems } from '../api';

export default function Folder() {
  const { dirName } = useParams();
  const {name, items} = getItems(dirName);
  return (
    <div>
      <h1>{name}</h1>
        <ul>
          {items.filter((dir) => dir.type ==="dir").map(({ name, type }) =>
            <li key={name}>
              <Link to={name}>{name}, {type}</Link>
            </li>
          )}
        </ul>
        <ul>
          {items.filter((file) => file.type ==="file").map(({ size, name }) =>
            <li key={name}>
              {name}, {size}
            </li>
          )}
        </ul>
        <Routes>
          <Route path={`:dirName/*`} element={<Folder />} />
        </Routes>
    </div>
  )
}