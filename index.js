const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const app = express()
const PORT = 8080
const controllers = require('./data/controllers')

app.use(morgan('dev'))
app.use(bodyParser.json())


app.post('/user', controllers.addUser);
// app.get('/users', controllers.getUsers);

app.use('/', (req, res)=>{
  res.sendStatus(404)
});

app.listen(PORT)
console.log(`Listening on port ${PORT}`)