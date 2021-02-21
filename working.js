var express = require("express");
var bodyParser = require("body-parser");
var fs = require("fs");
var Note = require("./note");
var User = require("./users");
var app = express();
app.use(bodyParser.json());
let jsonUsers = __dirname + "/users.json";
let usersData = new Note(jsonUsers);
var bcrypt = require("bcrypt");
// var users = [];

app.get("/users", (req, res) => {
  // res.json(users);
  console.log("getting users");
  return usersData
    .list()
    .then((users) => {
      res.json(users);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/users", async (req, res) => {
  try {
    let salt = await bcrypt.genSalt();
    let hashedPassword = await bcrypt.hash(req.body.password, salt);
    console.log(salt);
    console.log(hashedPassword);
    let user = { name: req.body.name, password: hashedPassword };
    console.log(user);
    return usersData
      .add(user)
      .then(() => {
        usersData.list();
      })
      .then((users) => {
        res.json("user added");
        res.status(200).json(users);
      });
  } catch {
    res.status(500).send();
  }
});

app.post("/users/login", async (req, res) => {
  let existingUser = fs.readFileSync(
    "./users.json",
    "utf-8",
    async (err, data) => {
      if (err) {
        throw err;
      }
      return await data;
    }
  );
  let parsed = JSON.parse(existingUser);
  let user = parsed.find((user) => user.name === req.body.name);
  if (user == null) {
    return res.status(400).send("user not found");
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      res.send("success");
    } else res.send("not allowed");
  } catch {
    res.status(500).send();
  }
});

app.listen(3000);
