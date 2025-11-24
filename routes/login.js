import express from 'express'
import { getUserByUsername } from '../data/userData.js'

const router = express.Router()

// MiddleWear
router.use(checkAccess)

// Endpoints

/*
router.get('/chats', (request,response)=>{
    response.render('chats', {knownUser: request.session.isLoggedIn})
})
    */

// HTTP request
router.post('/', (request, response)=>{
    const username = request.body.username
    const password = request.body.password
    if (checkUserCredientials(username, password)) {
        request.session.isLoggedIn = true
        response.redirect('/chats')
    } else {
        response.render('error', {data: {username:username, password: password}})
    }
})


// Hjælpe function
async function checkUserCredientials(username, password){
    // Hent brugeren baseret på brugernavn
    const user = await getUserByUsername(username)
    
    // 1. Tjek om brugeren findes, OG 2. Tjek om kodeordet stemmer overens
    if (user && user.password === password) {
        return true
    } 
    return false
}

function checkAccess(request, response, next) {
    console.log("Forsøg på adgang til siden: " + request.url);
    // forsøg på at se /chats siden UDEN at være logget ind
    if (request.url === '/chats' && !request.session.isLoggedIn){
        response.redirect('/')
    } else {
        // du er logget ind :) OK du får adgang
        next()
    }
}


export default router