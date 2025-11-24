import { createChat } from "../data/chatData.js";

async function runTest() {
    try {
        const chat = await createChat("Test Chat", 123);
        console.log("Chat oprettet:", chat);
    } catch (err) {
        console.error("Fejl:", err);
    }
}

runTest();
