const usersRouter = require('express').Router()
const User = require('../models/user')
const crypto = require('crypto')

usersRouter
  .route('/')

  .get(async (request, response) => {
    const users = await User.find({}).populate('blogs')
    return response.json(users)
  })

  .post(async (request, response) => {
    if (!request.body.username || !request.body.password)
      throw new Error('Username or password missing')
    const salt = crypto.randomBytes(32).toString('hex')
    if (request.body.password.length < 3) throw new Error('Too short password')
    const passwordHash = crypto
      .scryptSync(request.body.password, salt, 64)
      .toString('hex')
    const user = new User({
      username: request.body.username,
      passwordHash: passwordHash,
      salt: salt,
    })

    const result = await user.save()
    return response.status(201).json(result)
  })

module.exports = usersRouter
