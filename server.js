var users = [
  {
    id: 1,
    name: 'jack',
    password: 'secret'
  },
  {
    id: 2,
    name: 'Mark',
    password: '1'
  }
];

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

var passport = require("passport");
var jwt = require('jsonwebtoken');
var passport = require("passport");
var passportJWT = require("passport-jwt");

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

const app = express();
app.use(passport.initialize());


const PORT = 3001;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.session());

var jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('JWT');
jwtOptions.secretOrKey = 'secretKey';

var strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
  console.log('payload received', jwt_payload);
  // usually this would be a database call:
  var user = users.filter( user => user.id == jwt_payload.id)[0];
  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
});

passport.use(strategy);



app.post('/api/login', function(req, res, next) {
  if(req.body.name && req.body.password){
    var name = req.body.name;
  }

  
  // usually this would be a database call:
  console.log(users);
  
  var user = users.filter( user => user.name == name)[0];
  if( ! user ){
    next(new Error("Нет такого юзера"));
  }
  console.log(user);
  
  if(user.password === req.body.password) {
    // from now on we'll identify the user by the id and the id is the only personalized value that goes into our token
    var payload = {id: user.id};
    console.log('nice');
    
    var token = jwt.sign(payload, jwtOptions.secretOrKey);
    console.log(name);
    
    res.json({message: "ok", token: token, user:name});
  } else {
    next(new Error("Неверный пароль"));
}
});

app.get("/api/messages",   (req, res, next) => {
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

app.post("/api/messages",  (req, res) => {
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

app.delete("/api/messages/:id", passport.authenticate('jwt', { session: false }), (req, res) => {
  const id = parseInt(req.params.id) || 0;
  console.log(req);
  
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
  if (!err.statusCode) err.statusCode = 404;
  res.status(err.statusCode).json({ message: err.message });
});










app.listen(PORT, () => console.log(`listening on http://localhost:${PORT}`));
