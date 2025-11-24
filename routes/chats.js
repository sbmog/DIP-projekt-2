import express from 'express'
// 1. Importer funktionen til at hente data
import { getChats } from '../data/chatData.js' 

const router = express.Router()

// OVERSIGT: Vis listen af chats
router.get('/', async (request, response) => {
    // 2. Hent chats fra filen
    const chats = await getChats() 
    
    // 3. Render 'chats.pug' og send listen med
    response.render('chats', { chats: chats }) 
})

// SAMTALE: Vis en specifik chat
router.get('/:id', async (request, response) => {
    const id = parseInt(request.params.id)
    const chats = await getChats()
    const chat = chats.find(chat => chat.id === id)

    if (!chat) {
        return response.status(404).send("Chat ikke fundet")
    }
    
    // Render en ny view-fil til selve samtalen (vi opretter den om lidt)
    response.render('chatRoom', { chat: chat }) 
})

export default router