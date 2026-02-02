const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const createTransporter = () => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
        console.warn('⚠️ Email credentials missing. Running in DRY RUN mode.');
        return null; // Return null to indicate no transporter
    }

    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_APP_PASSWORD
        }
    });
};

const sendEmail = async (to, subject, html) => {
    const transporter = createTransporter();

    if (!transporter) {
        console.log(`[DRY RUN] Would send email to: ${to}`);
        console.log(`[DRY RUN] Subject: ${subject}`);
        console.log(`[DRY RUN] Content: ${html}`);
        // Simulate success
        return { messageId: 'dry-run-id', response: 'Simulated success' };
    }

    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            html
        });
        console.log('Message sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

module.exports = { sendEmail };
