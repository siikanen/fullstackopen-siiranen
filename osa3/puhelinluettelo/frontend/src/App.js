import React, { useState, useEffect } from 'react';

import phonebookService from './services/phonebook'
import './App.css'

import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import Person from './components/Person'
import Notification from './components/Notification'

const App = () => {
  const [filter, setFilter] = useState(null)
  const [persons, setPersons] = useState([])
  const [message, setMessage] = useState({msg: null, style: 'hidden'})

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
    const personName = persons.find(p => p.id === id ).name
    if ( window.confirm( `Delete ${personName}?` ) ) {
        phonebookService
          .remove(id)
          .then(setPersons(persons.filter(
            person => person.id !== id
          ))
          )
          .catch(() => {
            messageHandler(`${personName} already deleted from the server`, 'error');
          })
      }
    messageHandler(`${personName} deleted`, 'default')
  }

  const messageHandler = (message,style) => {
    setMessage({msg: message, style: style})
    setTimeout(() => {
      setMessage({msg: null, style: 'hidden'})
    }, 2500)
  }

    console.log(message)

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message.msg} style={message.style} />
      <Filter setFilterFunction={setFilter} />
      <h2>Add new</h2>
      <PersonForm
        persons={persons}
        setPersonsFunction={setPersons}
        messageHandler={messageHandler}
      />
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
