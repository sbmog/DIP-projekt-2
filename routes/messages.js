import express from 'express'
import { createMessage, updateMessage, deleteMessage, getMessageById } from '../data/messageData.js'

// VIGTIGT: mergeParams: true gør, at vi kan få adgang til ':id' parameteren
// fra den router, der monterer denne (i dette tilfælde routes/chats.js)
const router = express.Router({ mergeParams: true })

// POST / (som oversættes til POST /chats/:id/messages)
router.post('/', async (request, response) => {
    const chatId = parseInt(request.params.id);
    const messageContent = request.body.content;

    // Hent bruger-ID fra sessionen
    const userId = request.session.userId;

    try {
        await createMessage(messageContent, userId, chatId); //
        // Omdiriger tilbage til chatrummet
        response.redirect(`/chats/${chatId}`);
    } catch (error) {
        console.error("Fejl ved oprettelse af besked:", error);
        response.status(500).send("Fejl ved oprettelse af besked");
    }
});

// PATCH /:messageId (Opdater besked) - PATCH /chats/:chatId/messages/:messageId
router.patch('/:messageId', async (request, response) => {
    if (!await authorizeMessageAccess(request, response)) {
        return
    }

    const chatId = parseInt(request.params.id);
    const messageId = parseInt(request.params.messageId);
    const newContent = request.body.content;

    try {
        const updatedMsg = await updateMessage(messageId, newContent);
        if (updatedMsg) {
            response.redirect(`/chats/${chatId}`);
        } else {
            response.status(404).send("Besked ikke fundet");
        }
    } catch (error) {
        console.error("Fejl ved opdatering af besked:", error);
        response.status(500).send("Fejl ved opdatering af besked");
    }
});

// DELETE /:messageId (Slet besked) - DELETE /chats/:chatId/messages/:messageId
router.delete('/:messageId', async (request, response) => {
    if (!await authorizeMessageAccess(request, response)) {
        return
    }

    const chatId = parseInt(request.params.id);
    const messageId = parseInt(request.params.messageId);

    try {
        const success = await deleteMessage(messageId)

        if (success) {
            // Omdiriger tilbage til chatrummet
            response.redirect(`/chats/${chatId}`)
        } else {
            response.status(404).send('Besked ikke fundet')
        }
    } catch (error) {
        console.error('Fejl ved sletning af besked:', error)
        response.status(500).send('Fejl ved sletning af besked')
    }
})

// Hjælpe function til tjekke ejerskab/admin
async function authorizeMessageAccess(request, response) {
    const messageId = parseInt(request.params.messageId)

    const currentUserId = request.session.userId
    const userLevel = request.session.user.userLvl

    const message = await getMessageById(messageId)

    if (!message) {
        response.status(404).send('Besked ikke fundet')
        return false
    }

    const isLevel3Admin = userLevel === 3
    const isOwner = message.user === currentUserId

    if (isLevel3Admin || (userLevel >= 2 && isOwner)) {
        request.chat = chat
        return true
    } else {
        response.status(403).send('Adgang nægtet. Du har ikke tilladelse til at rette/slette denne besked.')
        return false
    }
}


export default router