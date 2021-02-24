const express = require('express')

const app = express();

app.use(express.static(__dirname + "/public"))
app.set('view engine', 'ejs')

const PORT = process.env.port || 3000;

app.listen(PORT)

app.get('/', (req, res) => {
    res.render('index')
})

