import Message from "../models/message.js";
import { promises as fs } from "fs";

const FILE = "./files/messages.json";

async function getMessages() {
    try {
        const txt = await fs.readFile(FILE, "utf8");
        return JSON.parse(txt);
    } catch {
        return [];
    }
}

async function saveMessages(messages) {
    await fs.writeFile(FILE, JSON.stringify(messages, null, 2), "utf8");
}

// Opret ny besked
export async function createMessage(messageContent, userId, chatId) {
    const messages = await getMessages();

    const id = messages.length ? Math.max(...messages.map(m => m.id)) + 1 : 1;

    const msg = new Message(id, messageContent, userId, chatId);
    messages.push(msg);

    await saveMessages(messages);
    return msg;
}

// Hent alle beskeder
export async function getAllMessages() {
    return getMessages();
}

// Hent beskeder for en chat
export async function getMessagesByChat(chatId) {
    const messages = await getMessages();
    return messages.filter(m => m.chat === chatId);
}

// Hent beskeder for en bruger
export async function getMessagesByUser(userId) {
    const messages = await getMessages();
    return messages.filter(m => m.user === userId);
}

// Hent beskeder ved id
export async function getMessageById(messageId) {
    const messages = await getMessages();
    return messages.find(m => m.id === messageId);
}

// Opdater besked
export async function updateMessage(messageId, newContent) {
    const messages = await getMessages();
    const index = messages.findIndex(m => m.id === messageId);

    if (index === -1) {
        return null; // Besked ikke fundet
    }

    // Opdater indhold og oprettelsesdato
    messages[index].messageContent = newContent;
    messages[index].oprettelsesDato = new Date().toISOString(); 
    
    await saveMessages(messages);
    return messages[index];
}

// Slet besked
export async function deleteMessage(messageId) {
    const messages = await getMessages();
    const initialLength = messages.length;
    
    const newMessages = messages.filter(m => m.id !== messageId);
    
    if (newMessages.length === initialLength) {
        return false; // Besked ikke fundet
    }

    await saveMessages(newMessages);
    return true; // Besked slettet
}