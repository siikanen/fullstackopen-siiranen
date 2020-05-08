import React, { useState, useEffect } from 'react';
import phonebookService from './services/phonebook'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import Person from './components/Person'

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
