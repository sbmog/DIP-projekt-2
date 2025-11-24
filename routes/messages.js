import express from 'express'
import { createMessage, updateMessage, deleteMessage } from '../data/messageData.js'

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
    const chatId = parseInt(request.params.id);
    const messageId = parseInt(request.params.messageId);

    try {
        const success = await deleteMessage(messageId); //

        if (success) {
            // Omdiriger tilbage til chatrummet
            response.redirect(`/chats/${chatId}`); 
        } else {
            response.status(404).send("Besked ikke fundet");
        }
    } catch (error) {
        console.error("Fejl ved sletning af besked:", error);
        response.status(500).send("Fejl ved sletning af besked");
    }
});

export default router