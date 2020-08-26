const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-beautiful-unique-validation')

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: 'User {VALUE} already exists',
    minlength: [3, 'must be longer than 3 characters'],
  },
  passwordHash: {
    type: String,
    required: true,
  },
  salt: {
    type: String,
    required: true,
  },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
      default: [],
    },
  ],
})

userSchema.set('toJSON', {
  transform: (_document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString()
    delete returnedObj._id
    delete returnedObj.__v
    delete returnedObj.passwordHash
    delete returnedObj.salt
  },
})
userSchema.plugin(uniqueValidator, {
  defaultMessage: 'Must be unique',
})

module.exports = mongoose.model('User', userSchema)
