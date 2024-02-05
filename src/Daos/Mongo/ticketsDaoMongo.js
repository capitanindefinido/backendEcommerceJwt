const { ticketsModel } = require("../../models/tickets.model.js");

class TicketDaoMongo {
    constructor() {}

    async get () {
        let tickets = await ticketsModel.find()
        return tickets
    }
    async getTicketById  (ticketId)  {
        try {
          let ticket = await ticketsModel.findById(ticketId).lean();
          return ticket;
        } catch (error) {
          console.error("Error al obtener el ticket por ID:", error);
          return "Error interno";
        }
      }
      async addTicket(ticket) {
        try {
            let result = await ticketsModel.create(ticket);
            return result
        } catch (error) {
            console.error("Error en la creación del ticket:", error);
            return "Error interno";
        }
    }
}

module.exports = TicketDaoMongo;