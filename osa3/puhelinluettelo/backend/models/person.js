const mongoose = require('mongoose')

const MONGO_URL = process.env.MONGO_URL || 'mongodb://mongodb:27017/test'
const MONGO_USER = process.env.MONGO_USER
const MONGO_PASS = process.env.MONGO_PASS || process.argv[2]
const dbURL = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@${MONGO_URL}`

mongoose
  .connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log('Connected to the database'))
  .catch((err) => console.log('Failed to connect to the database', err.message))

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 5,
    unique: true,
  },
  number: {
    type: String,
    minlength: 5,
  },
})

personSchema.plugin(require('mongoose-beautiful-unique-validation'))

personSchema.set('toJSON', {
  transform: (_document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString()
    delete returnedObj._id
    delete returnedObj.__v
  },
})

module.exports = mongoose.model('Person', personSchema)
