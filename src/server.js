const express = require("express");
const ejs = require("ejs");
const path = require("path");
const pdf = require("html-pdf");
const puppeteer = require("puppeteer");

const app = express();

const passengers = [
  {
    name: "Joyce",
    flightNumber: 7859,
    time: "18h00",
  },
  {
    name: "Brock",
    flightNumber: 7859,
    time: "18h00",
  },
  {
    name: "Eve",
    flightNumber: 7859,
    time: "18h00",
  },
];

app.get("/pdf", async (req, res) => {
  //headless serve para que o puppeteer não abra uma pagina no navegador
  const browser = await puppeteer.launch({ headless: true });
  //nova pagina
  const page = await browser.newPage();

  await page.goto("http://localhost:3000/", {
    waitUntil: "networkidle0",
  });

  //puppeteer ja possui funcao para gerar o pdf
  const pdf = await page.pdf({
    printBackground: true,
    format: "Letter",
    margin: {
      top: "20px",
      bottom: "40px",
      right: "10px",
      left: "10px",
    },
  });

  await browser.close();
  res.contentType("application/pdf");

  return res.send(pdf);
});

app.get("/", (req, res) => {
  ejs.renderFile(
    path.join(__dirname, "print.ejs"),
    { passengers },
    (err, html) => {
      if (err) return res.send("Ocorreu um erro ao gerar o PDF");
      res.send(html);
    }
  );
});

app.listen(3000);
