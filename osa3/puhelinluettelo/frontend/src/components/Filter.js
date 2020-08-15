import React from 'react'


const Filter = ({setFilterFunction}) => {
  const handleFilterChange = (event) => {
    const filter = event.target.value
    filter === "" 
      ? setFilterFunction(null) 
      : setFilterFunction(filter)
  }

  return (
    <>
    <p>Filter shown with</p>
    <input
      onChange={handleFilterChange}
    />
    </>
  )
}

export default Filter
