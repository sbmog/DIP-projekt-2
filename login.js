import express from 'express'

const router = express.Router()

// MiddleWear
router.use(checkAccess)

// Endpoints
router.get('/logout', (request,response)=>{
    request.session.destroy()
    response.redirect('/')
})

router.get('/secret', (request,response)=>{
    response.render('secret', {knownUser: request.session.isLoggedIn})
})

// HTTP request
router.post('/login', (request, response)=>{
    const username = request.body.username
    const password = request.body.password
    if (checkUserCredientials(username, password)) {
        request.session.isLoggedIn = true
        response.redirect('/secret')
    } else {
        response.render('error', {data: {username:username, password: password}})
    }
})


// Hjælpe function
function checkUserCredientials(username, password){
    let credientials = false
    if (username == 'Jeppe K' && password == 'panje') {
        credientials = true
    } 
    return credientials
}

function checkAccess(request, response, next) {
    console.log("Forsøg på adgang til siden: " + request.url);
    // forsøg på at se /secret siden UDEN at være logget ind
    if (request.url === '/secret' && !request.session.isLoggedIn){
        response.redirect('/')
    } else {
        // du er logget ind :) OK du får adgang
        next()
    }
}


export default router