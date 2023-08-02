const express = require('express')
const morgan = require('morgan')
const cors = require('cors');
const bodyParser = require('body-parser')
const gpt = require('./data/controllers/gpt.js')
const app = express()
const PORT = 8080
const usersControllers = require('./data/controllers/users')
const postControllers = require('./data/controllers/posts')


app.use(cors());
app.use(express.json());
app.use(morgan('dev'))
app.use(bodyParser.json())

app.use("/gpt", gpt());

app.post('/user', usersControllers.addUser);
app.get('/user', usersControllers.getUser);

app.use('/', (req, res)=>{
  res.sendStatus(404)
});


app.listen(PORT)
console.log(`Listening on port ${PORT}`)