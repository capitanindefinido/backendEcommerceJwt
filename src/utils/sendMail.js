const nodemailer = require('nodemailer')
const { configObject: {nodemailer_password, nodemailer_user} } = require('../config/config')

const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: nodemailer_user,
        pass: nodemailer_password
    }
})

exports.sendMail = async ({to, subject, html}) => {
    console.log(__dirname + '/nodejs.png')
    return await transport.sendMail({
        from: `Ecommerce Node <${nodemailer_user}>`,
        to,
        subject,
        html   
        // attachments: [{
        //     filename: 'nodejs.png',
        //     path: __dirname + '/nodejs.png',
        //     cid: 'nodejs'
        // }]
        /* `
            <div>
                <h1>localhost:4000/change-password?user=${to}</h1>
            </div>
            `  */
    })
}
