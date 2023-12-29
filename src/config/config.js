const mongoose = require('mongoose')
const dotenv = require('dotenv')
const { program } = require('../utils/commander')
const MongoSingleton = require('../utils/MongoSingleton')

const { mode } = program.opts()

dotenv.config({
    path: mode === 'development' ? './.env.development' : './.env.production'
})

const configObject = {
    port:                process.env.PORT,
    url_base:            process.env.URL_BASE,
    mongo_url:           process.env.MONGO_URL,
    cookie_key:          process.env.COOKIE_KEY,
    jwt_sign_key_secret: process.env.JWT_SIGN_KEY_SECRET,
    gh_client_id:        process.env.GH_CLIENT_ID,
    gh_client_secret:    process.env.GH_CLIENT_SECRET,
    gh_callback_url:     process.env.GH_CALLBACK_URL,
    persistence:         process.env.PERSISTENCE,
    nodemailer_password: process.env.NODEMAILER_PASSWORD,
    nodemailer_user:     process.env.NODEMAILER_USER,
    twilio_sid:          process.env.TWILIO_CID,
    twilio_token:        process.env.TWILIO_TOKEN_PRIVATE,
    twilio_phone:        process.env.TWILIO_PHONE_NUMBER,
    conectDB:            async () => await MongoSingleton.getInstance(process.env.MONGO_URL)
}

module.exports = {
    configObject
}


