import * as nodemailer from "nodemailer";
import { config } from './config';

class Mail {
    constructor(
        public from?: string,
        public to?: string,
        public subject?: string,
        public message?: string,
        public attachments?: any) { }

    sendMail() {

        let mailOptions = {
            from: this.from,
            to: this.to,
            subject: this.subject,
            html: this.message,
            attachments: this.attachments
        };

        const transporter = nodemailer.createTransport({
            host: config.emailHost,
            port: config.emailPort,
            secure: true,
            auth: {
                user: config.emailUser,
                pass: config.emailPassword
            },
            tls: { rejectUnauthorized: false }
        });

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                return error;
            } else {
                return "Email sended with success!";
            }
        });
    }
}

export default new Mail;