import express from 'express'
const router = express.Router()

//MiddleWare

//EndPoint

router.get('/', (request, response) => {
    response.json(users)
})

router.get('/:id', (request, response) => {
    const id = parseInt(request.params.id)

    //Find den specifikke user
    const user = users.find(user => user.id === id)

    //Hvis user ikke findes
    if (!user) {
        return response.status(404).json({ error: "User ikke fundet" })
    }
    response.json(user)
})

router.get('/:id/messages', (request, response) => {

})

export default router