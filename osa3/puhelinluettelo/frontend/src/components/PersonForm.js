import React, { useState } from "react";
import phonebookService from "../services/phonebook";

const PersonForm = ({ persons, setPersonsFunction, messageHandler }) => {
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");

  const handleNameChange = (event) => setNewName(event.target.value);
  const handleNumberChange = (event) => setNewNumber(event.target.value);

  const addNewName = (event) => {
    event.preventDefault();
    const newNameObj = { name: newName, number: newNumber };
    const alreadyInBook = persons.find((p) => p.name === newNameObj.name);

    if (alreadyInBook !== undefined) {
      const overwriteOld = window.confirm(
        `${newName} is already added to phonebook. ` +
          "Replace the old number with the new one?"
      );
      if (overwriteOld) {
        phonebookService
          .replace(newNameObj, alreadyInBook.id)
          .then((responseObj) => {
            setPersonsFunction(
              persons.map((name) =>
                name.id === alreadyInBook.id ? responseObj : name
              )
            );
            messageHandler(
              `${responseObj.name} updated successfully`,
              "success"
            );
          })
          .catch((err) => console.error(err));
      }
    } else {
      phonebookService
        .create(newNameObj)
        .then((responseObj) => {
          setPersonsFunction(persons.concat(responseObj));
          messageHandler(`${responseObj.name} added successfully`, "success");
        })
        .catch((err) => messageHandler(err.response.data.error, "error"));
    }
  };

  return (
    <form onSubmit={addNewName}>
      <div>
        name:
        <input value={newName} onChange={handleNameChange} />
      </div>
      <div>
        number:
        <input value={newNumber} onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default PersonForm;
