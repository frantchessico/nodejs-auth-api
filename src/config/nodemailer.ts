import nodemailer from 'nodemailer';


export const transport = nodemailer.createTransport({
    host: 'premium291.web-hosting.com',
    port: 465,
    auth: {
        user: 'hi@franciscoinoque.tech',
        pass: 'Luisa@0!'
    }
})