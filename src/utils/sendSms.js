const twilio = require('twilio')
const { configObject: {twilio_sid, twilio_token, twilio_phone} } = require('../config/config')

const cliente = twilio(twilio_sid, twilio_token)

/* The `exports.sendSms` function is sending an SMS message to a specific phone number. It takes two
parameters, `first_name` and `last_name`, which are used to personalize the message. The message
body is constructed using template literals to include the first and last name. The `from` field
specifies the Twilio phone number from which the message will be sent, and the `to` field specifies
the recipient's phone number. The `cliente.messages.create` method is used to create and send the
SMS message. */
exports.sendSms = (first_name, last_name) => cliente.messages.create({
    body: `Gracias por tu compra ${first_name} ${last_name}`,
    from: twilio_phone,
    to: '+34613652154'
})

/* The `exports.sendWhatsapp` function is sending a WhatsApp message to a specific phone number. */
exports.sendWhatsapp = (first_name, last_name) => cliente.messages.create({
    body: `Gracias por tu compra ${first_name} ${last_name}`,
    from: 'whatsapp:+14155238886',
    to: 'whatsapp:+34613652154'
})

