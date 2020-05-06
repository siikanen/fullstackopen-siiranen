import React, { useState, useEffect } from 'react';
import axios from 'axios'
//import './App.css';

const Person = ({name,number}) => {
  return (
    <li>{name}: {number}</li>
  )
}

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

const PersonForm = ({persons, setPersonsFunction}) => {
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  
  const handleNameChange = (event) => setNewName(event.target.value) 
  const handleNumberChange = (event) => setNewNumber(event.target.value)

  const addNewName = (event) => {
    event.preventDefault()
    const newNameObj = { name: newName, number: newNumber }

    if (persons.map( (p) => p.name ).includes(newName))
      alert(`${newName} is already added to phonebook`)
    else
      setPersonsFunction(persons.concat(newNameObj))
  }

  return (
    <form onSubmit={addNewName}>
      <div>
        name: 
        <input
          value={newName}
          onChange={handleNameChange}
        />
      </div>
      <div>
        number: 
        <input
          value={newNumber}
          onChange={handleNumberChange}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )

}

const App = () => {
  const [filter, setFilter] = useState(null)
  const [persons, setPersons] = useState([])

  useEffect(() => {
    axios
      .get("http://localhost:3001/persons")
      .then(response => {
        setPersons(response.data)
      })
  }, [])
  
  const personsToShow = persons.filter( 
      person => {
        // if filter is empty, return all names
        if ( filter === null )
          return true
        else {
          return person.name.toLowerCase().includes(
            filter.toLowerCase()) ? true : false
        }
      }
    )

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter setFilterFunction={setFilter} />
      <h2>Add new</h2>
      <PersonForm persons={persons} setPersonsFunction={setPersons} />
      <h2>Numbers</h2>
        <ul>
          {personsToShow.map((person) => 
            <Person 
              key={person.name+person.number} 
              name={person.name} 
              number={person.number} 
            />
          )}
        </ul>
    </div>
  )
}

export default App;
