import Message from "../models/message.js"
import { promises as fs } from "fs"

const FILE = "./files/messages.json"

// Hent beskeder
async function getMessages() {
    try {
        const txt = await fs.readFile(FILE, "utf8")
        return JSON.parse(txt)
    } catch {
        return []
    }
}

async function saveMessages(messages) {
    await fs.writeFile(FILE, JSON.stringify(messages, null, 2), "utf8")
}

// Opret ny besked
export async function createMessage(messageContent, userId, chatId) {
    const messages = await getMessages()

    const id = messages.length ? Math.max(...messages.map(m => m.id)) + 1 : 1

    const msg = new Message(id, messageContent, userId, chatId)
    messages.push(msg)

    await saveMessages(messages)
    return msg
}

export async function getAllMessages() {
    return getMessages()
}

// Hent beskeder for en specifik chat
export async function getMessagesByChat(chatId) {
    const messages = await getMessages()
    return messages.filter(m => m.chat === chatId)
}

// Hent beskeder for en specifik bruger
export async function getMessagesByUser(userId) {
    const messages = await getMessages()
    return messages.filter(m => m.user === userId)
}

// Hent beskeder ved besked-id
export async function getMessageById(messageId) {
    const messages = await getMessages()
    return messages.find(m => m.id === messageId)
}

// Ret/Opdater besked
export async function updateMessage(messageId, newContent) {
    const messages = await getMessages()
    const index = messages.findIndex(m => m.id === messageId)

    if (index === -1) {
        return null
    }

    // Opdater indhold og oprettelsesdato
    messages[index].messageContent = newContent
    messages[index].oprettelsesDato = new Date().toISOString()
    
    await saveMessages(messages)
    return messages[index]
}

// Slet besked
export async function deleteMessage(messageId) {
    const messages = await getMessages()
    const initialLength = messages.length
    
    const newMessages = messages.filter(m => m.id !== messageId)
    
    if (newMessages.length === initialLength) {
        return false;
    }

    await saveMessages(newMessages)
    return true;
}

// Slet beskeder fra specifik chat
export async function deleteMessagesByChat(chatId) {
    const messages = await getMessages()
    
    // Filtrer beskeder, der IKKE tilhører den specificerede chat
    const updatedMessages = messages.filter(msg => msg.chat !== chatId)
    
    // Gem de resterende beskeder
    await saveMessages(updatedMessages)
    
    return true
}