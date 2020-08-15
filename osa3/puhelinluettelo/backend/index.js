require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/person')
const PORT = process.env.PORT || 3001
const app = express()

const unknownEndpoint = (_request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('body', (req) => JSON.stringify(req.body))
app.use(
  morgan((tokens, req, res) => {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'),
      '-',
      tokens['response-time'](req, res),
      'ms',
      tokens.body(req),
    ].join(' ')
  })
)

app.get('/info', (_req, res) => {
  Person.find({}).then((persons) => {
    return res.send(
      `<p>Phonebook has info for ${persons.length} people</p>` +
        `<p>${Date()}</p>`
    )
  })
})

app.get('/api/persons', (_req, res) => {
  Person.find({}).then((persons) => res.json(persons))
})

app.post('/api/persons', (req, res, next) => {
  if (!req.body.name || !req.body.number)
    return res.status(400).json({ error: 'name or number missing' })

  const newPerson = new Person({
    name: req.body.name,
    number: req.body.number,
  })
  newPerson
    .save()
    .then((savedPerson) => {
      res.json(savedPerson)
    })
    .catch((err) => next(err))
})

app.put('/api/persons/:id', (req, res, next) => {
  if (!req.body.name || !req.body.number || !req.params.id)
    return res.status(400).json({ error: 'id, name or number missing' })

  const personToUpdate = {
    name: req.body.name,
    number: req.body.number,
  }

  Person.updateOne({ _id: req.params.id }, personToUpdate)
    .then(() => res.json({ ...personToUpdate, id: req.params.id }))
    .catch((err) => next(err))
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => res.json(person))
    .catch((err) => next(err))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.remove({ _id: req.params.id }, { single: true })
    .then(() => res.status(204).send())
    .catch((err) => next(err))
})

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError')
    return response.status(400).json({ error: 'malformatted id' })
  if (error.name === 'ValidationError')
    return response.status(400).json({ error: 'malformatted field' })

  next(error)
}

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}\n`)
})
