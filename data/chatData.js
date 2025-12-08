import { promises as fs } from "fs"
import Chat from "../models/chat.js"
import { deleteMessagesByChat } from './messageData.js'

const FILE = "./files/chats.json"

// Læs eksisterende chats fra JSON
export async function getChats() {
    try {
        const txt = await fs.readFile(FILE, "utf8")
        return JSON.parse(txt)
    } catch {
        return [] // Hvis filen ikke findes
    }
}

// Gem chats til JSON
async function saveChats(chats) {
    await fs.writeFile(FILE, JSON.stringify(chats, null, 2), "utf8")
}

// Opret ny chat
export async function createChat(name, userId) {
    const chats = await getChats()

    // Generer næste id
    const id = chats.length ? Math.max(...chats.map(c => c.id)) + 1 : 1

    const chat = new Chat(id, name, userId)
    chats.push(chat)

    await saveChats(chats)
    return chat
}

// Hent chats for en specifik bruger
export async function getChatsByUser(userId) {
    const chats = await getChats()
    // Filtrerer alle chats og returnerer kun dem, hvor brugeren er opretteren
    return chats.filter(c => c.user === userId)
}

//Updater chat
export async function updateChat(id, newName) {
    const chats = await getChats()
    const chatIndex = chats.findIndex(chat => chat.id === id)

    if (chatIndex === -1) {
        return null // Chat ikke fundet
    }

    // Opdater navnet
    chats[chatIndex].name = newName
    
    // Gem ændringerne
    await saveChats(chats)
    
    return chats[chatIndex]
}

// Slet chat
export async function deleteChat(id) {
    const chats = await getChats()
    const initialLength = chats.length
    
    // 1. Slet alle beskeder, der tilhører chatten (VIGTIGT for dataintegritet)
    try {
        // Kald den nye funktion i messageData.js
        await deleteMessagesByChat(id)
    } catch (error) {
        console.error(`Fejl: Kunne ikke slette beskeder for chat ${id}. Fortsætter med at slette chat.`, error)
    }
    
    // 2. Filtrer chatten fra listen
    const updatedChats = chats.filter(chat => chat.id !== id)
    
    if (updatedChats.length === initialLength) {
        return false // Ingen chat blev slettet
    }

    // 3. Gem den opdaterede chat-liste
    await saveChats(updatedChats)
    
    return true // Sletning lykkedes
}