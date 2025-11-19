import express from 'express'
const router = express.Router()

//MiddleWare

//EndPoints

router.get('/', (request, response) => {
    response.json(chats)
})

router.get('/:id', (request, response) => {
    const id = parseInt(request.params.id)

    //Find den specifikke chat
    const chat = chats.find(chat => chat.id === id)

    //Hvis chat ikke findes
    if (!chat) {
        return response.status(404).json({ error: "Chat ikke fundet" })
    }
    response.json(chat)
})

router.get('/:id/messages', (request, response) => {
    const id = parseInt(request.params.id)

})

router.get('/messages/:id', (request, response) => {

})

export default router