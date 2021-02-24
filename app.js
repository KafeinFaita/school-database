const express = require('express')

const app = express();

app.use(express.static(__dirname + "/public"))

const PORT = process.env.port || 3000;

app.listen(PORT)

app.get('/', (req, res) => {
    res.send('HELLO')
})

