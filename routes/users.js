import express from 'express'
import { getUsers } from '../data/userData.js'

const router = express.Router()

// Middleware til at sikre, at brugeren er logget ind og er Level 3
function authorizeAdmin(request, response, next) {
    const userLevel = request.session.userLvl

    if (userLevel && userLevel === 3) {
        // Hvis brugeren er admin, fortsæt
        next()
    } else {
        // Hvis ikke admin, nægt adgang
        response.status(403).send('Adgang nægtet. Kræver administratortilladelse (Niveau 3).')
    }
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

export default router