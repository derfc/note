var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var fs = require("fs");
// var basicAuth = require("express-basic-auth");
var Note = require("./note");
var app = express();
app.use(bodyParser.json());
app.use(cors());

let jsonFile = __dirname + "/note.json";
let noteData = new Note(jsonFile);
var port = 8080;

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
  res.json(noteStore[req.params.id]);
});

app.post("/note", (req, res) => {
  console.log("posting json file");
  let note = req.body;
  console.log("posting ", note);
  return noteData
    .add(note)
    .then(() => noteData.list())
    .then((notes) => {
      res.json("posted");
      res.status(200).json(notes);
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
      res.status(200).json(notes);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.delete("/note/:index", (req, res) => {
  console.log("deleting json file");
  let index = req.params.index;
  return noteData
    .remove(index)
    .then(() => noteData.list())
    .then((notes) => {
      res.json("Deleted");
      res.status(200).json(notes);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.listen(port, () => {
  console.log("Running on port ", port);
});
