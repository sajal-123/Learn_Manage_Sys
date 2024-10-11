import nodemailer, { Transporter } from 'nodemailer';
import path from 'path';
import ejs from 'ejs';
import dotenv from 'dotenv';

dotenv.config();

interface EmailOptions {
    email: string;
    subject: string;
    template: string;
    data: { [key: string]: any };
}

const SendEmail = async (options: EmailOptions): Promise<void> => {
    try {
        const transporter: Transporter = nodemailer.createTransport({
            host: process.env.SMTPHOST,
            service: process.env.SMTPSERVICE,
            port: parseInt(process.env.SMTPPORT || '587'),
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        const { email, subject, template, data } = options;
        const templatePath = path.join(__dirname, '../mails', `${template}`);
        const html: string = await ejs.renderFile(templatePath, data);

        const mailOptions = {
            from: process.env.SMTP_EMAIL,
            to: email,
            subject,
            html,
        };
        console.log(process.env.SMTP_EMAIL,process.env.SMTPPORT,process.env.SMTP_PASSWORD,process.env.SMTPSERVICE,process.env.SMTPHOST)
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error(`Error sending email to ${options.email}:`, error);
        throw new Error(`Failed to send email to ${options.email}`);
    }
};

export default SendEmail;
