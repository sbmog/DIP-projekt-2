import express from 'express'
import { createUser, getUsers } from '../data/userData.js'

const router = express.Router()

// Middleware til at sikre, at brugeren er logget ind og er Level 3
function authorizeAdmin(request, response, next) {
    const userLevel = request.session.userLvl

//EndPoint

router.get('/create', (request, response) => {
    if (!authorizeAdmin(request, response)) return

    response.render('createUser', {title: 'Opret bruger'})
})

router.post('/create', async (request, response) => {
    if (!authorizeAdmin(request, response)) return

    const { username, password, userLvl } = request.body
    const level = parseInt(userLvl) || 1

    try {
        await createUser(username, password, level)
        response.redirect('/chats')
    } catch (error) {
        console.error('Fejl ved oprettelse af bruger:', error)
        response.status(400).send(`Fejl ved oprettelse: ${error.message}`)
    }
})

router.get('/', async (request, response) => {
    const users = await getUsers()
    response.json(users)
})

router.get('/:id', async(request, response) => {
    const id = parseInt(request.params.id)
    const users = await getUsers()

    //Find den specifikke user
    const user = users.find(user => user.id === id)

    //Hvis user ikke findes
    if (!user) {
        return response.status(404).json({ error: "User ikke fundet" })
}

router.use(authorizeAdmin)

// Endpoint: GET /users/
// Hent og vis alle brugere (Admin only)
router.get('/', async (request, response) => {
    // Kald funktionen til at hente alle brugere
    const allUsers = await getUsers() 

    // Sender user info, men ikke password
    const safeUsers = allUsers.map(u => ({
        id: u.id,
        userName: u.userName,
        oprettelsesDato: u.oprettelsesDate,
        userLvl: u.userLvl
    }))

    response.render('userList', { users: safeUsers, title: 'Brugeradministration' }) // 'userList' er den nye Pug-fil
})

//Hjælpe function
function authorizeAdmin(request, response) {
    if (request.session.userLvl === 3) {
        return true
    }
    response.status(403).send('Adgang nægtet. Kræver administrator (Niveau 3) rettigheder.')
    return false
}

export default router