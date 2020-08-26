const mongoose = require('mongoose')
const express = require('express')
require('express-async-errors')
const jwt = require('express-jwt')
const app = express()
const cors = require('cors')

const config = require('./utils/config')
const logger = require('./utils/logger')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

const middleware = require('./utils/middleware')

mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    logger.info('Connected to database')
  })
  .catch((error) => {
    logger.error(error.message)
  })

app.use(cors())

app.use(
  jwt({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] }).unless({
    path: ['/api/login', '/api/users', { url: '/api/blogs', methods: ['GET'] }],
  })
)

app.use(express.json())

app.use(middleware.requestLogger)

app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)
app.use('/api/blogs', blogsRouter)

app.use(middleware.errorHandler)
app.use(middleware.unknownEndpoint)

module.exports = app
