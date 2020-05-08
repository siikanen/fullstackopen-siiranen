import React from 'react'


const Person = ({name,number,handleRemove}) => {
  return (
    <li>{name}: {number} 
      <button onClick={handleRemove}>delete</button>
    </li>
  )
}

export default Person
