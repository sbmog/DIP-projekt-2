import express from 'express'
// 1. Importer funktionen til at hente data
import { getChats, createChat } from '../data/chatData.js' 
import { getMessagesByChat } from '../data/messageData.js' 
import { getUsers } from '../data/userData.js'
import messagesRouter from './messages.js'

const router = express.Router()
router.use('/:id/messages', messagesRouter)

// Nu håndterer messagesRouter alle requests til /chats/:id/messages
router.use('/:id/messages', messagesRouter)

// OVERSIGT: Vis listen af chats
router.get('/', async (request, response) => {
    const chats = await getChats() 
    response.render('chats', { chats: chats }) 
})

// OPRETTELSE
router.get('/create', (request, response) => {
    response.render('createChat')
})

router.post('/create', async (request, response) => {
    const chatNavn = request.body.chatName; 
    await createChat(chatNavn, 123); 
    response.redirect('/chats'); 
})

// SAMTALE: Vis en specifik chat
router.get('/:id', async (request, response) => {
    const id = parseInt(request.params.id)
    const chats = await getChats()
    const chat = chats.find(chat => chat.id == id)

    if (!chat) {
        return response.status(404).send("Chat ikke fundet")
    }
    
    // Hent beskeder og brugere
    const messages = await getMessagesByChat(id) 
    const users = await getUsers()
    chat.messages = messages.map(msg => {
        const userObj = users.find(u => u.id == msg.user);
        return { 
            content: msg.messageContent,
            userName: userObj ? userObj.userName : 'Bruger ' + msg.user,
            userId: msg.user,
            oprettelsesDato: msg.oprettelsesDato
        }
    })

    response.render('chatRoom', { chat: chat, currentUser: request.session.userId })
})



export default router