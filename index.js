require('dotenv').config();

const app = require('./server')
const mongoose = require('mongoose');


// mongo connection
const DB_URL = process.env.MONGODB_LOCAL_SERVER;
console.log(DB_URL);
mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to mongo server successfully'))
    .catch(() => console.log('connection failed :('));


// redis connection
const redis = require('redis');
const client = redis.createClient({
    url: 'redis://127.0.0.1:6379',
    socket: {
        keepAlive: true,
    },
});

app.listen(3000, () => {
    console.log(`listenning on port 3000`)
})