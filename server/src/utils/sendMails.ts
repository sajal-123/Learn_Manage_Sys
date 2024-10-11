import nodemailer, { Transporter } from 'nodemailer';
import path from 'path';
import ejs from 'ejs';
import { env } from './EnviromentHandler';

interface EmailOptions {
    email: string;
    subject: string;
    template: string;
    data: { [key: string]: any };
}

const SendEmail = async (options: EmailOptions): Promise<void> => {
    try {
        const transporter: Transporter = nodemailer.createTransport({
            host: env.smtp.host,
            service: env.smtp.service,
            port: parseInt(env.smtp.port || '587'),
            auth: {
                user: env.smtp.email,
                pass: env.smtp.password,
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
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error(`Error sending email to ${options.email}:`, error);
        throw new Error(`Failed to send email to ${options.email}`);
    }
};

export default SendEmail;
