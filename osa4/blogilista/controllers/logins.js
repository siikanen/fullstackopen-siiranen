const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const user = await User.findOne({ username: request.body.username })
  console.log(user)
  const password = request.body.password
  const passwordCorrect =
    user === null
      ? false
      : crypto.scryptSync(password, user.salt, 64) === user.passwordHash

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password',
    })
  }


  let expiration = new Date()
  expiration = expiration.setHours(expiration.getHours + 6)

  const userForToken = {
    username: user.username,
    id: user._id,
    exp: expiration
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  response.status(200).send({ token, username: user.username })
})

module.exports = loginRouter
