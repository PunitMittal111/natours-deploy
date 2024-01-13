// Sending Emails with Nodemailer
const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlTOText = require('html-to-text');

// Building a Complex Email Handler //
// new Email(user, url).sendWelcome()
module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstname = user.name.split(' ')[0];
    this.url = url;
    this.from = `Punit Mital ${process.env.EMAIL_FROM}`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // SENDGRID
      return nodemailer.createTransport({
        service: 'mailtrap',
        auth: {
          user: process.env.BREVO_USERNAME,
          pass: process.env.BREVO_PASSWORD,
        },
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // Send the actual Email
  async send(template, subject) {
    // 1) Render HTML based on a puged template
    const html = pug.renderFile(
      `${__dirname}/../../starter/views/email/${template}.pug`,
      {
        firstname: this.firstname,
        url: this.url,
        subject,
      },
    );

    // 2)Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlTOText.convert(html),
    };

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('Welcome', 'Welcome to the Natours family!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 mintues)',
    );
  }
};

// const sendEmail = async (options) => {
// // 1) Creatre a Transporter
// const transporter = nodemailer.createTransport({
//   host: process.env.EMAIL_HOST,
//   port: process.env.EMAIL_PORT,
//   auth: {
//     user: process.env.EMAIL_USERNAME,
//     pass: process.env.EMAIL_PASSWORD,
//   },
// });

// // 2) Define the email options
// const mailOptions = {
//   from: 'Punit Mital <punitnohar111@gmail.com>',
//   to: options.email,
//   subject: options.subject,
//   text: options.message,
//   // html:
// };

//   // 3) Actually send the email with nodemialer
//   await transporter.sendMail(mailOptions);
// };

// module.exports = sendEmail;
