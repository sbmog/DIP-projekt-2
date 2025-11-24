import { promises as fs } from "fs"
import Chat from "../models/chat.js"

const FILE = "./files/chats.json"

// Læs eksisterende chats fra JSON
export async function getChats() {
    try {
        const txt = await fs.readFile(FILE, "utf8");
        return JSON.parse(txt);
    } catch {
        return []; // Hvis filen ikke findes
    }
}

// Gem chats til JSON
async function saveChats(chats) {
    await fs.writeFile(FILE, JSON.stringify(chats, null, 2), "utf8");
}

// Opret ny chat
export async function createChat(name, userId) {
    const chats = await getChats();

    // Generer næste id
    const id = chats.length ? Math.max(...chats.map(c => c.id)) + 1 : 1;

    const chat = new Chat(id, name, userId);
    chats.push(chat);

    await saveChats(chats);
    return chat;
}