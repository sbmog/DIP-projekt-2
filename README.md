# Full-Stack Chat Server & Client

Dette projekt er udviklet som en del af 4. semester på Datamatikeruddannelsen (faget C# og .NET / Systemintegration). Projektet demonstrerer opbygningen af en komplet chat-server og tilhørende klient ved brug af moderne webteknologier og RESTful arkitektur.

## Projektbeskrivelse
Systemet består af en Node.js-baseret server, der håndterer chatrum, brugere og beskeder. Klienten tilgår serverens data via et RESTful API og præsenterer en dynamisk brugerflade, hvor adgangen styres af et rettighedssystem i tre niveauer.

### Hovedfunktioner
* **RESTful API:** Komplette endpoints til CRUD-operationer på chats, beskeder og brugere.
* **Rettighedsstyring (ACL):**
    * **Niveau 1:** Læseadgang til chats.
    * **Niveau 2:** Mulighed for at oprette, slette og rette egne chats.
    * **Niveau 3 (Admin):** Fulde rettigheder til at administrere alle chats og se brugerlister.
* **Data Persistens:** Arkivering af data på disk i JSON-format ved brug af `node:fs`, som indlæses automatisk ved serverstart.
* **Dynamisk UI:** Kombination af server-side rendering med **Pug** og klientside **DOM manipulation** for en responsiv oplevelse.
* **Polling:** Implementeret real-tids opdatering af chatlister og beskeder via polling-mekanismer.

## Teknologier & Værktøjer
* **Backend:** Node.js, Express.js
* **Frontend:** JavaScript (ES6+), Pug Templates, CSS3
* **Session:** Express-session til autentificering
* **Storage:** JSON-baseret fil-arkivering (fs)
* **Værktøjer:** Visual Studio Code, Git/GitHub, Nodemon

## Struktur
* `/routes`: Håndtering af API endpoints for chats, users og messages.
* `/models`: Definition af datamodeller (Chat, Message, User).
* `/views`: Dynamiske Pug-skabeloner.
* `/assets`: Klientside JavaScript (DOM-styring og polling) samt CSS-styling.
* `/data`: Logik til håndtering af JSON-filer og persistens.

## Forfattere
Maja Kragelund, Rune Hyldgaard Jensen og Sidse Borch Mogensen
