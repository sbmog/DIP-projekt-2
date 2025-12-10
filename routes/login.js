import express from 'express'
import { getUserByUsername, updateUserStatus } from '../data/userData.js'

const router = express.Router()

// MiddleWear
router.use(checkAccess)

// HTTP request
router.post('/', async (request, response) => {
    const username = request.body.username
    const password = request.body.password
    // Kald den asynkrone funktion. user vil nu indeholde brugerobjektet eller null.
    const user = await checkUserCredientials(username, password)

    if (user) {
        request.session.isLoggedIn = true
        request.session.userId = user.id
        request.session.userLvl = user.userLvl
        request.session.userName = user.userName
        await updateUserStatus(user.id, true)
        request.session.save(() => {
            response.redirect('/chats')
        })
    } else {
        response.render('frontpage', {
            loginError: "Forkert brugernavn eller kodeord.",
            // Send de værdier, som frontpage skal bruge
            title: 'Velkommen til din chat'
        })
    }
})


// Hjælpe function (returnere brugerobjektet)
async function checkUserCredientials(username, password) {
    const user = await getUserByUsername(username) //

    // Tjek om brugeren findes, OG om kodeordet stemmer overens
    if (user && user.password === password) {
        return user // Returner hele brugerobjektet (inkl. ID)
    }
    return null
}

function checkAccess(request, response, next) {
    console.log("Tjekker session... Forsøg på adgang til siden: " + request.url);
    // forsøg på at se /chats siden UDEN at være logget ind
    if (request.url === '/chats' && !request.session.isLoggedIn) {
        response.redirect('/')
    } else {
        // Du er logget ind
        next()
    }
}


export default router