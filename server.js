const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

const PORT = 3000;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/api/messages", (req, res, next) => {
  fs.readFile(path.join(__dirname, "message.json"), "utf-8", (err, data) => {
    if (err) {
      // res.status(404).json({error: err.toString()})
      console.log("err");

      next(new Error("Ошибка сервера"));
    } else
      res.json({
        result: JSON.parse(data)
      });
  });
});

app.post("/api/messages", (req, res) => {
  fs.writeFile("message.json", JSON.stringify(req.body), err => {
    if (err) {
      throw err;
    }
    console.log("Saved!");
  });

  res.json({
    data: "ok"
  });
});

app.delete("/api/messages/:id", (req, res) => {
  const id = parseInt(req.params.id) || 0;

  fs.readFile(path.join(__dirname, "message.json"), "utf-8", (err, data) => {
    if (err) return;

    const items = JSON.parse(data).items.filter(item => item.id !== id);

    fs.writeFile("message.json", JSON.stringify({ items }), err => {
      if (err) throw err;
      console.log("Saved!");
      res.json({ items });
    });
  });
});

app.put("/api/messages/:id", (req, res) => {
  const id = parseInt(req.params.id) || 0;

  fs.readFile(path.join(__dirname, "message.json"), "utf-8", (err, data) => {
    if (err) return;

    const items = JSON.parse(data).items;

    for (let k in items) {
      if (items[k].id === id) {
        items[k].text = req.body.value;
      }
    }

    fs.writeFile("message.json", JSON.stringify({ items }), err => {
      if (err) throw err;
      console.log("Saved!");
      res.json({ items });
    });
  });
});

app.get("/error", function(req, res, next) {
  let err = new Error(`${req.ip} tried to access /Forbidden`); // Sets error message, includes the requester's ip address!
  err.statusCode = 403;
  next(err);
});

app.use(function(err, req, res, next) {
  // Any request to this server will get here, and will send an HTTP
  // response with the error message 'woops'
  if (!err.statusCode) err.statusCode = 200;
  res.status(err.statusCode).json({ message: err.message });
});

app.listen(PORT, () => console.log(`listening on http://localhost:${PORT}`));
