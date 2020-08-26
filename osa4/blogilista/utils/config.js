require('dotenv').config()

const SERVER_PORT = process.env.SERVER_PORT || 3030
const DB_NAME = process.env.DB_NAME
const MONGODB_USER = process.env.MONGODB_USER
const MONGODB_PASS = process.env.MONGODB_PASS
const MONGODB_URI = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASS}@cluster0.mbb53.mongodb.net/${DB_NAME}?retryWrites=true&w=majority
`

module.exports = {
  MONGODB_URI,
  SERVER_PORT,
}
