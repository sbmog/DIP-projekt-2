import express from 'express'
// 1. Importer funktionen til at hente data
import { getChats, createChat, deleteChat } from '../data/chatData.js'
import { getMessagesByChat } from '../data/messageData.js'
import { getUsers } from '../data/userData.js'
import messagesRouter from './messages.js'


const router = express.Router()

router.use('/:id/messages', messagesRouter)

// JSON API endpoint til at hente beskeder, der er nyere end en given ID
router.get('/:id/messages/new', async (request, response) => {
    const chatId = parseInt(request.params.id);
    // Hent lastId fra URL'en (f.eks. ?lastId=10)
    const lastMessageId = parseInt(request.query.lastId) || 0; 
    
    // Simpel adgangstjek
    if (!request.session.isLoggedIn) {
        return response.status(401).json({ error: "Uautoriseret" });
    }

    try {
        const allMessages = await getMessagesByChat(chatId);
        const allUsers = await getUsers(); // Antager denne er importeret

        // Filtrer beskeder: Kun dem med ID større end lastMessageId
        const newMessages = allMessages.filter(msg => msg.id > lastMessageId);

        // Berig beskeder med brugernavnet
        const messagesWithUsers = newMessages.map(msg => {
            const user = allUsers.find(u => u.id === msg.user);
            return {
                id: msg.id,
                messageContent: msg.messageContent,
                oprettelsesDato: msg.oprettelsesDato,
                user: msg.user,
                chat: msg.chat,
                userName: user ? user.userName : 'Ukendt Bruger'
            };
        });

        // Returner de nye data som JSON
        response.json({ messages: messagesWithUsers });
    } catch (error) {
        console.error('Fejl ved hentning af nye beskeder:', error);
        response.status(500).json({ error: 'Kunne ikke hente nye beskeder' });
    }
});

// OVERSIGT: Vis listen af chats
router.get('/', async (request, response) => {
    const chats = await getChats()
    const userLevel = request.session.userLvl

    response.render('chats', { chats: chats, userLvl: userLevel })
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
    const currentUserId = request.session.userId

    if (!currentUserId) {
        return response.redirect('/');
    }

    await createChat(chatNavn, currentUserId);
    request.session.save(() => {
        response.redirect('/chats')
    })
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
            id: msg.id,
            userId: msg.user,
            content: msg.messageContent,
            userName: userObj ? userObj.userName : 'Bruger ' + msg.user,
            oprettelsesDato: msg.oprettelsesDato
        }
    })

    const currentUserId = request.session.userId
    const userLevel = request.session.userLvl

    response.render('chatRoom', { chat: chat, currentUser: currentUserId, userLvl: userLevel })
})

router.patch('/:id', async (request, response) => {
    if (!await authorizeChatAccess(request, response)) {
        return
    }

    const id = parseInt(request.params.id)
    const newName = request.body.name

    await updateChat(id, newName);

    request.session.save(() => {
        response.redirect('/chats')
    })
})

router.delete('/:id', async (request, response) => {
    if (!await authorizeChatAccess(request, response)) {
        return
    }
    const id = parseInt(request.params.id)
    const success = await deleteChat(id);

    if (success) {
        request.session.save(() => {
            response.status(204).send()
        })
    } else {
        response.status(404).send("Chatten blev ikke fundet")
    }
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
    const userLevel = request.session.userLvl

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