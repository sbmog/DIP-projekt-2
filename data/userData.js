import { promises as fs } from "fs";
import User from "../models/user.js";

const FILE = "./files/users.json";

// Læs users fra JSON
export async function getUsers() {
    try {
        const txt = await fs.readFile(FILE, "utf8");
        return JSON.parse(txt);
    } catch (error) {
        // Opretter en initial liste, hvis filen ikke findes
        if (error.code === 'ENOENT') {
             // Opret testbrugere for niveauer 1, 2 og 3
            const initialUsers = [
                new User(1, 'level1_user', 'pass1', 1),
                new User(2, 'level2_user', 'pass2', 2),
                new User(3, 'level3_admin', 'pass3', 3)
            ];
            await saveUsers(initialUsers);
            return initialUsers;
        }
        return [];
    }
}

// Gem users til JSON
export async function saveUsers(users) {
    await fs.writeFile(FILE, JSON.stringify(users, null, 2), "utf8");
}

// Find user ved username (til login)
export async function getUserByUsername(username) {
    const users = await getUsers();
    return users.find(u => u.userName === username);
}

// Find user ved id
export async function getUserById(id) {
    const users = await getUsers();
    // Sikrer at vi kun returnerer de offentlige data fra User-modellen
    const user = users.find(u => u.id === id);
    return user ? user : null;
}

// Opret ny bruger
export async function createUser(userName, password, userLvl) {
    const users = await getUsers();

    if (users.find(u => u.userName === userName)) {
        throw new Error("User with this username already exists");
    }

    const id = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;

    const user = new User(id, userName, password, userLvl);
    users.push(user);

    await saveUsers(users);
    return user;
}