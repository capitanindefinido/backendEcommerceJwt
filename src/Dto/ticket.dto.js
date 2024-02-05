const { nanoid } = require("nanoid")


class TicketDTO {
    constructor(ticket) {
        this.code = nanoid()
        this.purchase_datetime = new Date()
        this.amount = ticket.amount
        this.purchaser = ticket.purchaser
    }
}

module.exports = TicketDTO