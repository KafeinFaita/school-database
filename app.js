const express = require('express')
const mainRoutes = require('./routes/mainRoutes')

const app = express();

app.use(express.static(__dirname + "/public"))
app.set('view engine', 'ejs')

app.use(mainRoutes)

const PORT = process.env.port || 3000;
app.listen(PORT)



