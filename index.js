

const express = require('express')
const graphqlHTTP = require('express-graphql')

const schema = require('./schema')
const { initDatabase } = require('./db')
const { authMiddleware } = require('./auth')
const cors = require('cors')

initDatabase()
const app = express();
app.use(cors())
app.use(authMiddleware())
app.use((req, res, next) => {
  console.log('new request', Date.now())
  next()
})

app.use('/api', graphqlHTTP({
  schema: schema,
  graphiql: true,
}));


app.listen(4000, () => console.log('listening on port', 4000))