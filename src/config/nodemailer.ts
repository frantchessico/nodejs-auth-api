import nodemailer from 'nodemailer';


const host_email = process.env.HOST!
export const transport = nodemailer.createTransport({
    host: `${host_email}`,
    port: process.env.EMAIL_PORT,
    auth: {
        user: `${process.env.USER}`,
        pass: `${process.env.PASS}`
    }
})