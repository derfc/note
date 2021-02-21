var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var fs = require("fs");
var Note = require("./note");
var User = require("./users");
var hb = require("express-handlebars");
var bcrypt = require("bcrypt");
var app = express();
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(cors());
app.engine("handlebars", hb({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

let jsonUsers = __dirname + "/users.json";
let usersData = new Note(jsonUsers);

let jsonFile = __dirname + "/note.json";
let noteData = new Note(jsonFile);
var port = 8080;

app.get("/", (req, res) => {
  console.log("diu");

  res.render("index");
  console.log(req);
});
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

app.post("/users/login", async (req, res) => {
  console.log(req.body);
  let userName = req.body.username;
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
  let user = parsed.find((user) => user.name === userName);
  if (user == null) {
    try {
      let salt = await bcrypt.genSalt();
      let hashedPassword = await bcrypt.hash(req.body.password, salt);
      console.log(salt);
      console.log(hashedPassword);
      let user = { name: userName, password: hashedPassword };
      console.log(user);
      return usersData
        .add(user)
        .then(() => {
          usersData.list();
        })
        .then((users) => {
          res.redirect(`http://localhost:${port}/users/${userName}`);
          // res.render("usersHome", {
          //   title: userName,
          //   userName: userName,
          // });
          // res.status(200).json(users);
        });
    } catch {
      res.status(500).send();
    }
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      // res.send("success");
      res.redirect(`http://localhost:${port}/users/${userName}`);
      // .render("usersHome", {
      //   title: userName,
      //   userName: userName,
      // });
    } else res.send("wrong password");
  } catch {
    res.status(500).send();
  }
});

app.get("/users/:username", (req, res) => {
  console.log("still here");
  console.log(req.params.username);
  res.render("usersHome", {
    title: req.params.username,
    userName: req.params.username,
  });
});

// app.post("/users/login", async (req, res) => {
//   let existingUser = fs.readFileSync(
//     "./users.json",
//     "utf-8",
//     async (err, data) => {
//       if (err) {
//         throw err;
//       }
//       return await data;
//     }
//   );
//   let parsed = JSON.parse(existingUser);
//   let user = parsed.find((user) => user.name === req.body.name);
//   if (user == null) {
//     return res.status(400).send("user not found");
//   }
//   try {
//     if (await bcrypt.compare(req.body.password, user.password)) {
//       res.send("success");
//     } else res.send("not allowed");
//   } catch {
//     res.status(500).send();
//   }
// });

app.get("/note", (req, res) => {
  console.log("getting json file");
  return noteData
    .list()
    .then((notes) => {
      res.json(notes);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/note/:id", (req, res) => {
  // res.json(noteStore[req.params.id]);
});

app.post("/note", (req, res) => {
  console.log("posting json file");
  console.log(req.body);
  let userName = Object.keys(req.body)[0];
  let note = req.body;
  console.log("posting ", note);
  return noteData
    .add(note)
    .then(() => noteData.list())
    .then((notes) => {
      res.redirect(`http://localhost:${port}/users/${userName}`);
      // res.json("posted");
      // res.status(200).json(notes);
    });
});

app.put("/note/:index", (req, res) => {
  console.log("updating json file");
  let index = req.params.index;
  console.log("index: ", index);
  let newNote = req.body;
  console.log("new note: ", newNote);
  return noteData
    .update(index, newNote)
    .then(() => noteData.list())
    .then((notes) => {
      res.json("updated");
      // res.status(200).json(notes);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.delete("/note/:username/:index", (req, res) => {
  console.log("deleting json file");
  let userName = req.params.username;
  let index = req.params.index;
  return noteData
    .remove(userName, index)
    .then(() => noteData.list())
    .then((notes) => {
      res.redirect(`http://localhost:${port}/users/${userName}`);
      // res.status(200).json(notes);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.listen(port, () => {
  console.log("Running on port ", port);
});
