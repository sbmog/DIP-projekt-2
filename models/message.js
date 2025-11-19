export default class Message {
    constructor(id, messageContent, userId, chatID) {
        this.id = id
        this.messageContent = messageContent
        this.oprettelsesDato = new Date().toISOString()
        this.user = userId
        this.chat = chatID
    }
}