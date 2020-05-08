import React, { useState, useEffect } from 'react';
import phonebookService from './services/phonebook'

const Person = ({name,number,handleRemove}) => {
  return (
    <li>{name}: {number} 
      <button onClick={handleRemove}>delete</button>
    </li>
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
    const alreadyInBook = persons.find(p => p.name === newNameObj.name)

    if (alreadyInBook !== undefined) {
      const overwriteOld = window.confirm(`${newName} is already added to phonebook. `
                                        + 'Replace the old number with the new one?')
      if (overwriteOld) {
        phonebookService
          .replace(newNameObj, alreadyInBook.id)
          .then(responseObj => {
            setPersonsFunction(persons.map(
              name => name.id === alreadyInBook.id ? responseObj : name))
          })
        .catch(err => console.error(err))
      }
    } else {
      phonebookService
        .create(newNameObj)
        .then(responseObj => {
          setPersonsFunction(persons.concat(responseObj))
        })
    }
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
    phonebookService
    .getAll()
    .then(initialPersons => setPersons(initialPersons))
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

    const removePersonId = (id) => {
      if ( window.confirm(
        `Delete ${persons.find(p => p.id === id ).name}?` ) ) {
          phonebookService
            .remove(id)
            .then(setPersons(persons.filter(
              person => person.id !== id
          ))
        )
      }
    }

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
              key={person.id} 
              name={person.name} 
              number={person.number} 
              handleRemove={() => removePersonId(person.id)}
            />
          )}
        </ul>
    </div>
  )
}

export default App;
