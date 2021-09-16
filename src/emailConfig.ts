import { transcode } from "buffer";

const nodemailer = require('nodemailer');

export function emailConfig() {
    const transponder = nodemailer.createTransport({
            port: 465,               // true for 465, false for other ports
            host: "smtp.gmail.com",
            auth: {
                user: 'pedro@nftartstation.com',
                pass: 'p16h12(*)F1993',
            },
            secure: true,
        });

    return transponder;
}

    
