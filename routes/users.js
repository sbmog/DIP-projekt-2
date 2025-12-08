import express from 'express'
import { createUser, getUsers, updateUserStatus} from '../data/userData.js'

const router = express.Router()

//Hjælpe function
function authorizeAdmin(request, response) {
    if (request.session.userLvl === 3) {
        return true
    }
    response.status(403).send('Adgang nægtet. Kræver administrator (Niveau 3) rettigheder.')
    return false
}

//EndPoint

// OPRET BRUGER: Vis formular (Kun Admin)
router.get('/create', (request, response) => {
    if (!authorizeAdmin(request, response)) return

    response.render('createUser', { title: 'Opret bruger' })
})

// OPRET BRUGER: Håndter POST (Kun Admin)
router.post('/create', async (request, response) => {
    if (!authorizeAdmin(request, response)) return

    const { username, password, userLvl } = request.body
    const level = parseInt(userLvl) || 1

    try {
        await createUser(username, password, level)
        request.session.save(() => {
            response.redirect('/users')
        })
    } catch (error) {
        console.error('Fejl ved oprettelse af bruger:', error)
        response.status(400).send(`Fejl ved oprettelse: ${error.message}`)
    }
})

router.get('/', async (request, response) => {
    const allUsers = await getUsers()

    const safeUsers = allUsers.map(u => ({
        id: u.id,
        userName: u.userName,
        oprettelsesDato: u.oprettelsesDate,
        userLvl: u.userLvl,
        isOnline: u.isOnline
    }))

    response.render('userList', { users: safeUsers, title: 'Brugeradministration' })
})

router.get('/:id', async (request, response) => {
    const id = parseInt(request.params.id)
    const users = await getUsers()

    //Find den specifikke user
    const user = users.find(user => user.id === id)

    //Hvis user ikke findes
    if (!user) {
        return response.status(404).json({ error: "User ikke fundet" })
    }
    response.json(user)
})

export default router