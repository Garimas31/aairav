// /*<!-- -------------------------------------------------- -->
// <!-- SERVER: server.js (optional Node.js backend to send email) -->
// <!-- Save as server.js and run with `node server.js` after installing dependencies -->*/

const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Route
app.post('/send-email', async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!email || !message) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `${name} <${email}>`,
      to: process.env.TO_EMAIL,
      subject: `Website Contact: ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\n${message}`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

console.log(process.env.SMTP_HOST);
console.log("ENV CHECK:", process.env.SMTP_HOST);

// old
// const express = require('express');
// const nodemailer = require('nodemailer');
// const bodyParser = require('body-parser');
// const action = "http://localhost:3000/send-email";
// require('dotenv').config();

// const app = express();
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

// app.post('/send-email', async (req, res) => {
//   const { name, email, phone, message } = req.body;
//   if (!email || !message) return res.status(400).json({ error: 'Missing fields' });

//   try {
//     const transporter = nodemailer.createTransport({
//       host: process.env.SMTP_HOST,
//       // port: Number(process.env.SMTP_PORT) || 587,
//       secure: false, // true for 465
//       auth: {
//         user: process.env.SMTP_USER,
//         pass: process.env.SMTP_PASS,
//       },
//     });

//     const mailOptions = {
//       from: `${name} <${email}>`,
//       to: process.env.TO_EMAIL,
//       subject: `Website Contact: ${name}`,
//       text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\n${message}`,
//     };

//     await transporter.sendMail(mailOptions);
//     res.json({ ok: true });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to send email' });
//   }
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log('Server running on', PORT));

// // .env file should contain: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, TO_EMAIL



