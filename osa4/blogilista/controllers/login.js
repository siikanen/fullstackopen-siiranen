const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const user = await User.findOne({ username: request.body.username })
  const password = request.body.password
  const passwordCorrect = user === null
    ? false
    : crypto.scryptSync(password, user.salt, 64).toString('hex') === user.passwordHash

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'Invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
    createdAt: new Date()
  }
    const jwtOptions = {
        algorithm: "HS256",
        expiresIn: "6h"
    }

  const token = jwt.sign(userForToken, process.env.JWT_SECRET, jwtOptions)

  response
    .status(200)
    .send({ token, username: user.username })
})

module.exports = loginRouter

