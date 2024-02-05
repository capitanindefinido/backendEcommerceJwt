const { Schema, model } = require("mongoose");

const ticketsCollection = "ticket";

const ticketSchema = new Schema({
    code: String,
    purchase_datetime: Date,
    amount: Number,
    purchaser: String,
    id_cart_ticket: String 
});
const ticketsModel = model(ticketsCollection, ticketSchema);

module.exports = { ticketsModel };