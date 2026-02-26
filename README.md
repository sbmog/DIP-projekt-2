# Full-Stack Chat Server & Client

This project was developed as part of the 4th semester of the Computer Science program (specializing in C#, .NET, and System Integration). The project demonstrates the construction of a complete chat server and an accompanying client using modern web technologies and a RESTful architecture.

## Project Description
The system consists of a Node.js-based server that manages chat rooms, users, and messages. The client accesses the server's data via a RESTful API and presents a dynamic user interface where access is controlled by a three-tier permission system.

### Key Features
* **RESTful API:** Comprehensive endpoints for CRUD operations on chats, messages, and users.
* **Access Control Logic (ACL):**
    * **Level 1:** Read-only access to chats.
    * **Level 2:** Ability to create, delete, and edit the user's own chats.
    * **Level 3 (Admin):** Full rights to manage all chats and view user lists.
* **Data Persistence:** Archiving data on disk in JSON format using `node:fs`, which is automatically loaded upon server startup.
* **Dynamic UI:** A combination of server-side rendering with **Pug** and client-side **DOM manipulation** for a responsive experience.
* **Polling:** Implemented real-time updates of chat lists and messages via polling mechanisms.

## Technologies & Tools
* **Backend:** Node.js, Express.js
* **Frontend:** JavaScript (ES6+), Pug Templates, CSS3
* **Session:** Express-session for authentication
* **Storage:** JSON-based file archiving (fs)
* **Tools:** Visual Studio Code, Git/GitHub, Nodemon

## Structure
* `/routes`: Handling API endpoints for chats, users, and messages.
* `/models`: Definition of data models (Chat, Message, User).
* `/views`: Dynamic Pug templates.
* `/assets`: Client-side JavaScript (DOM management and polling) and CSS styling.
* `/data`: Logic for handling JSON files and persistence.

## Authors
Maja Kragelund, Rune Hyldgaard Jensen, and Sidse Borch Mogensen
