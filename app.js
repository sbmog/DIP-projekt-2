import express from 'express'
import session from 'express-session'
import loginRouter from './login.js'

const app = express()
const port = 8090


app.set('view engine', 'pug')
app.use(express.static('assets'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Middlewear
app.use(session({
    secret: 'Spencer',
    saveUninitialized: true,
    resave: true
}))
app.use(loginRouter)


// Endpoints
app.get('/', (request, response)=>{
    response.render('frontpage', {knownUser: request.session.isLoggedIn})
})

app.get('/chats', (request, response) => {
    response.json(chats)
})

app.get('/chats/:id', (request, response) => {
    const id = parseInt(request.params.id)

    //Find den specifikke chat
    const chat = chats.find(chat => chat.id === id)

    //Hvis chat ikke findes
    if (!chat){
        return response.status(404).json({error: "Chat ikke fundet"})
    }
    response.json(chat)
})

app.get('/chats/:id/messages', (request, response) => {
    const id = parseInt(request.params.id)

})

app.get('/chats/messages/:id', (request, response) => {

})

app.get('/users', (request, response) => {
    response.json(users)
})

app.get('/users/:id', (request, response) => {
    const id = parseInt(request.params.id)
    
    //Find den specifikke user
    const user = users.find(user => user.id === id)

    //Hvis user ikke findes
    if (!user) {
        return response.status(404).json({error: "User ikke fundet"})
    }
    response.json(user)
})

app.get('/users/:id/messages', (request, response) => {

})

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`)
})