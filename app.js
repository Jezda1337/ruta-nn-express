const express = require("express");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const path = require("path");

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(process.env.FRONT_END_PATH));

const handleForm = async (body) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    // port: 587,
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.USER_EMAIL_TEST,
      pass: process.env.USER_EMAIL_PASS_TEST, // new generated pass from googpe-apps
    },
  });

  await transporter.sendMail({
    from: `||${body.name}||`,
    to: process.env.TO_EMAIL_TEST, // list of receivers
    subject: `${body.email} ${body.name}`, // Subject line
    text: ``, // plain text body
    html: `
      <p>Ime i prezime: <h3>${body.name}</h3></p>
      <p">Email: <h3>${body.email}</h3></p>
      <p>Broj telefonta:<h3> ${body.phone} </h3></p>
      <p>Grad: <h3>${body.city}</h3></p>
      <p>Koliko dobro poznaje grad: <h3>${body.cityKTC}</h3></p>
      <p>Prevozno sredstvo: <h3>${body.vehicle}</h3></p>
      <p>Tip posla: <h3>${body.jobType}</h3></p>
      <p>Iskustvo u poslu: <h3>${body.exp}</h3></p>
    `, // html body
  });
};

app.post("/form", (req, res) => {
  const { body } = req;

  if (!body) return res.status(400).json({ message: "Something went wrong!" });

  handleForm(body);

  res.status(200).json(body);
});

app.get("*", (req, res) => {
  res.sendFile(process.env.FRONT_END_PATH + "index.html");
});

app.listen(process.env.PORT);
