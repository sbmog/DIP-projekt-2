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
    if (!authorizeMinLevel(request, response, 2)) {
        return
    }
    response.render('createChat')
})

router.post('/create', async (request, response) => {
    if (!authorizeMinLevel(request, response, 2)) {
        return
    }

    const chatNavn = request.body.chatName;
    const currentUserID = request.session.userId

    await createChat(chatNavn, currentUserID);
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

router.patch('/:id', async (request, response) => {
    if (!await authorizeChatAccess(request, response)) {
        return
    }

    const id = parseInt(request.params.id)
    const newName = request.body.name

    // TODO: Implementer updateChat i data/chatData.js og kald den her
    // await updateChat(id, newName); 

    response.status(501).send('PATCH logik skal implementeres i data/chatData.js og kaldes her.')
})

router.delete('/:id', async (request, response) => {
    if (!await authorizeChatAccess(request, response)) {
        return
    }

    const id = parseInt(request.params.id)

    // TODO: Implementer deleteChat i data/chatData.js og kald den her
    // await deleteChat(id); 

    response.status(501).send('DELETE logik skal implementeres i data/chatData.js og kaldes her.')
})

// hjælpe funktion til at tjekke userLevel opfylder min.
function authorizeMinLevel(request, response, minLevel) {
    const userLevel = request.session.userLvl

    if (userLevel && userLevel >= minLevel) {
        return true
    } else {
        response.status(403).send(`Adgang nægtet. Kræver minimum niveau ${minLevel}.`)
        return false
    }
}

// Hjælpe function til tjekke ejerskab/admin
async function authorizeChatAccess(request, response) {
    const id = parseInt(request.params.id)

    const currentUserId = request.session.userId
    const userLevel = request.session.user.userLvl

    const chats = await getChats()
    const chat = chats.find(c => c.id === id)

    if (!chat) {
        response.status(404).send('Chat ikke fundet')
        return false
    }

    const isLevel3Admin = userLevel === 3
    const isOwner = chat.user === currentUserId

    if (isLevel3Admin || (userLevel >= 2 && isOwner)) {
        request.chat = chat
        return true
    } else {
        response.status(403).send('Adgang nægtet. Du har ikke tilladelse til at rette/slette denne chat.')
        return false
    }
}

export default router