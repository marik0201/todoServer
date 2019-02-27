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

app.get("/api/messages", (req, res) => {
  fs.readFile(path.join(__dirname, "message.json"), "utf-8", (err, data) => {
    if (err)
      res.json({
        result: []
      });

    res.json({
      result: JSON.parse(data)
    });
  });
});

app.post("/api/messages", (req, res) => {
  console.log("body", req.body);

  fs.writeFile("message.json", JSON.stringify(req.body), err => {
    if (err) throw err;
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

app.listen(PORT, () => console.log(`listening on http://localhost:${PORT}`));
