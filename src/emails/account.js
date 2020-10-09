const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'carlomarcoortiz@gmail.com',
        subject: 'Thanks for Registering!',
        text: `Welcome to the app ${name}. Let me know how you get along with the app!`
    })
}

const sendFarewellEmail = (email,name)=> {
    sgMail.send({
        to: email,
        from: 'carlomarcoortiz@gmail.com',
        subject: 'We are sad to see you go! :(',
        text: `Goodbye ${name}. We would like to know why you cancelled.`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendFarewellEmail
}