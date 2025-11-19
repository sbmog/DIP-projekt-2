import express from 'express'
import session from 'express-session'

import loginRouter from './routes/login.js'
import chatsRouter from './routes/chats.js'
import usersRouter from './routes/users.js'

import chat from './models/chat.js'
import message from './models/message.js'
import user from './models/user.js'


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
app.use('/login', loginRouter)
app.use('/chats', chatsRouter)
app.use('/users', usersRouter)


// Endpoints
app.get('/', (request, response) => {
    response.render('frontpage', { knownUser: request.session.isLoggedIn })
})

app.get('/logout', (request, response) => {
    request.session.destroy()
    response.redirect('/')
})

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`)
})