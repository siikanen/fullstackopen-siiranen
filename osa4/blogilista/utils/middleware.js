const logger = require('./logger')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  if (!request.body['password']) logger.info('Body:  ', request.body)
  if (request.user)
    logger.info(`User: ${request.user.username}, id ${request.user.id}`)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)
  switch (error.name) {
    case 'Error':
      if (error.message == 'Forbidden')
        return response.status(403).json({ error: error.message })
      else return response.status(400).json({ error: error.message })
    case 'CastError':
      return response.status(400).send({ error: 'malformatted field' })
    case 'ValidationError': {
      if (error.errors.username)
        return response
          .status(400)
          .json({ error: error.errors.username.message })
      else return response.status(400).json({ error: error.message })
    }
    case 'SyntaxError':
      return response.status(400).json({ error: error.message })
    case 'ReferenceError':
      return response.status(400).json({ error: error.message })
    case 'UnauthorizedError':
      return response.status(401).json({ error: 'Missing or invalid token' })
    default:
      break
  }
  next(error)
}

module.exports = {
  unknownEndpoint,
  errorHandler,
  requestLogger,
}
