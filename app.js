import express from 'express'
import session from 'express-session'

const app = express()
const port = 8080


app.set('view enging', 'pug')
app.use(express.static('assets'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

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