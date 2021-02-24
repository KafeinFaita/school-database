const express = require('express')

const app = express();

const PORT = process.env.port || 3000;

app.listen(PORT)

app.get('/', (req, res) => {
    res.send('HELLO')
})