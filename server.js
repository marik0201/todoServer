const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

var passport = require("passport");
var Strategy = require("passport-local").Strategy;
var db = require("./src/db");

const app = express();

const PORT = 3001;

app.use(cors());

app.use(require("morgan")("combined"));
app.use(require("cookie-parser")());
app.use(
  require("express-session")({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static( __dirname + '/src/views'));

app.use(passport.initialize());
app.use(passport.session());



app.get("/login", function(req, res) {
  console.log("ERROR");
  app.render('index');
});

app.get("/", function(req, res) {
  console.log("REDIRECT");
  
  res.sendFile("index.html", { user: req.user });
});

app.post(
  "/api/login",
  passport.authenticate("local", { failureRedirect: "/login" }),
  function(req, res) {
    
    res.json({
      user: req.user.username
    });
  }
);

app.get("/api/messages", (req, res, next) => {
  fs.readFile(path.join(__dirname, "message.json"), "utf-8", (err, data) => {
    if (err) {
      // res.status(404).json({error: err.toString()})
      // throw err;
      console.log(err);

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




passport.use(
  new Strategy(function(username, password, cb) {
    db.users.findByUsername(username, function(err, user) {
      if (err) {
        return cb(err);
      }
      if (!user) {
        return cb(null, false);
      }
      if (user.password != password) {
        return cb(null, false);
      }
      return cb(null, user);
    });
  })
);

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  db.users.findById(id, function(err, user) {
    if (err) {
      return cb(err);
    }
    cb(null, user);
  });
});





app.listen(PORT, () => console.log(`listening on http://localhost:${PORT}`));
