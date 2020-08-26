const colors = require('colors')

const info = (...params) => {
  if (process.env.NODE_ENV !== 'test') console.log('INFO:'.green, ...params)
}

const error = (...params) => {
  if (process.env.NODE_ENV !== 'test') console.error('WARN:'.red, ...params)
}

module.exports = {
  info,
  error,
}
