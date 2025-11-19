export default class Chat {
    constructor(id, name, userId) {
        this.id = id
        this.name = name
        this.oprettelsesDato = new Date().toISOString()
        this.user = userId
        this.messages = []
    }

    addMessage(messageObject) {
        this.messages.push(messageObject)
    }
}