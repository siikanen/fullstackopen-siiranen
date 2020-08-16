const mongoose = require('mongoose')

const MONGO_URL = process.env.MONGO_URL || 'mongodb://mongodb:27017/test'
const MONGO_USER = process.env.MONGO_USER
const MONGO_PASS = process.env.MONGO_PASS || process.argv[2]

const url = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@${MONGO_URL}`
mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('success'))
  .catch(() => console.log('FAIL'))

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: process.argv[3],
  number: process.argv[4],
})
console.log('connecting')

person.save().then(() => {
  console.log('Person saved!')
  mongoose.connection.close()
})
