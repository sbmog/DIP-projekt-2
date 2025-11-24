import express from 'express'
// 1. Importer funktionen til at hente data
import { getChats, createChat } from '../data/chatData.js' 
import { getMessagesByChat } from '../data/messageData.js' 
import messagesRouter from './messages.js'

const router = express.Router()

// Nu håndterer messagesRouter alle requests til /chats/:id/messages
router.use('/:id/messages', messagesRouter)

// OVERSIGT: Vis listen af chats
router.get('/', async (request, response) => {
    // 2. Hent chats fra filen
    const chats = await getChats() 
    
    // 3. Render 'chats.pug' og send listen med
    response.render('chats', { chats: chats }) 
})

// Vis oprettelse side
router.get('/create', (request, response) => {
    response.render('createChat')
})

router.post('/create', async (request, response) => {
    const chatNavn = request.body.chatName; 
    
    // Vi bruger et fast bruger-ID (123) indtil du får login til at virke helt
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
    
    // Hent beskeder for denne chat
    const messages = await getMessagesByChat(id) 

    chat.messages = messages.map(msg => ({ 
        content: msg.messageContent, // Bruger messageContent fra modellen
        user: msg.user,
        oprettelsesDato: msg.oprettelsesDato
    }))
    // Render en ny view-fil til selve samtalen
    response.render('chatRoom', { chat: chat }) 
})



export default router