export default class user {
    constructor(id, userName, password, userLvl) {
        this.id = id
        this.userName = userName
        this.password = password
        this.oprettelsesDate = new Date().toISOString()
        this.userLvl = userLvl
    }

    getPublivDate() {
        return {
            id: this.id,
            userName: this.userName,
            oprettelsesDato: this.oprettelsesDate,
            userLevel: this.userLvl
        }
    }
}