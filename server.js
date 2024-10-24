const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express();

// request configs
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

// router import
const authRouter = require('./routes/authRouter')
const newsRouter = require('./routes/newsRouter')
const userRouter = require('./routes/userRouter')
const roleRouter = require('./routes/roleRouter')
const superRouter = require('./routes/superRouter')

// router integrations
app.use(express.json())
app.use('/auth', authRouter)
app.use('/news', newsRouter)
app.use('/users', userRouter)
app.use('/roles', roleRouter)
app.use('/super', superRouter)


module.exports = app;