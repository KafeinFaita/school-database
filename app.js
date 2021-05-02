const express = require('express')
const mainRoutes = require('./routes/mainRoutes')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const cookieParser = require('cookie-parser')
const app = express();

app.use(express.static(__dirname + "/public"))
app.use(methodOverride('_method'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

const PORT = process.env.PORT || 3000;
const dbURI = "mongodb+srv://kafein:kafeinfaita@cluster0.3xefo.mongodb.net/school-db?retryWrites=true&w=majority"

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(result => app.listen(PORT))
    .catch(err => console.log(err))

app.set('view engine', 'ejs')

app.use(mainRoutes)







