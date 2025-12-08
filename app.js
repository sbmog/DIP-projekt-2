import express from 'express'
import session from 'express-session'
import methodOverride from 'method-override'
import fs from 'fs'
import { updateUserStatus } from './data/userData.js'

import loginRouter from './routes/login.js'
import chatsRouter from './routes/chats.js'
import usersRouter from './routes/users.js'
import messagesRouter from './routes/messages.js'

const app = express()
const port = 8090


app.set('view engine', 'pug')

// Middlewear
app.use(express.static('assets'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const cssFolder = './assets/css'
try {
    const files = fs.readdirSync(cssFolder)
    app.locals.cssFiles = files.filter(file => file.endsWith('.css'))
} catch (err) {
    app.locals.cssFiles = []
}

app.use(methodOverride('_method'))

app.use(session({
    secret: 'Spencer',
    saveUninitialized: true,
    resave: true
}))

app.use((request, response, next) => {
    response.locals.isLoggedIn = request.session.isLoggedIn
    response.locals.userId = request.session.userId
    response.locals.userName = request.session.userName
    response.locals.userLvl = request.session.userLvl
    next()
})

app.use('/login', loginRouter)
app.use('/chats', chatsRouter)
app.use('/users', usersRouter)
app.use('/messages', messagesRouter)


// Endpoints
app.get('/', (request, response) => {
    response.render('frontpage', { knownUser: request.session.isLoggedIn })
})

app.get('/logout', async(request, response) => {
    const userId = request.session.userId

    if (userId) {
        // Bemærk: Denne funktion er nu async
        await updateUserStatus(userId, false) 
    }
    request.session.destroy()
    response.redirect('/')
})

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`)
})

