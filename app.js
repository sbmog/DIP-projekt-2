import express from 'express'
import session from 'express-session'
import router from './login.js'

const app = express()
const port = 8090


app.set('view engine', 'pug')
app.use(express.static('assets'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Middlewear
app.use('/login', router)

app.use(session({
    secret: 'Spencer',
    saveUninitialized: true,
    resave: true
}))


// Endpoints
app.get('/', (request, response)=>{
    response.render('frontpage', {knownUser: request.session.isLoggedIn})
})

app.get('/chats', (request, response) => {

})

app.get('/chats/:id', (request, response) => {

})

app.get('/chats/:id/messages', (request, response) => {

})

app.get('/chats/messages/:id', (request, response) => {

})

app.get('/users', (request, response) => {

})

app.get('/users/:id', (request, response) => {

})

app.get('/users/:id/messages', (request, response) => {

})

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`)
})