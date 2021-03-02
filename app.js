const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const NoteSQL = require("./notesql");
const hb = require("express-handlebars");
const bcrypt = require("bcrypt");
require("dotenv").config();
const knex = require("knex")({
	client: "postgresql",
	connection: {
		database: process.env.db_name,
		user: process.env.db_username,
		password: process.env.db_password,
	},
});
const app = express();
let currentUser;
app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);
app.use(bodyParser.json());
app.use(cors());
app.engine("handlebars", hb({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.use(express.static("public"));

const port = 8080;

let noteSQL = new NoteSQL("notes");

app.get("/", (req, res) => {
	currentUser = "";
	res.render("index");
});

app.post("/", async (req, res) => {
	console.log("login");
	let userName = req.body.username;
	let checkUser = knex("users").where("username", userName);
	checkUser.then(async (user) => {
		if (user[0]) {
			//login
			console.log("login");
			let hashedPassword = user[0].password;
			try {
				if (
					(await bcrypt.compare(req.body.password, hashedPassword)) ||
					req.body.password == hashedPassword
				) {
					currentUser = userName;
					res.redirect(`/user/notes`);
				} else {
					res.send("wrong password");
				}
			} catch (err) {
				res.status(500).send();
			}
		} else {
			//register
			console.log("register");
			try {
				let salt = await bcrypt.genSalt();
				let hashedPassword = await bcrypt.hash(req.body.password, salt);
				await knex("users").insert({
					username: userName,
					password: hashedPassword,
				});
				currentUser = userName;
				res.redirect(`/user/notes`);
			} catch {
				res.status(500).send();
			}
		}
	});
});

app.get("/user/notes", (req, res) => {
	console.log("getting note");
	return noteSQL
		.selectID(currentUser)
		.then((user_id) => {
			noteSQL.getNotes(user_id[0].id).then((data) => {
				res.render("usersHome", {
					data: data,
					title: currentUser,
					userName: currentUser,
				});
			});
		})
		.catch((err) => res.status(500).json(err));
});

app.post("/user/notes", (req, res) => {
	console.log("posting note");
	let note = req.body;
	let newNote = note[Object.keys(req.body)[0]];
	return noteSQL
		.selectID(currentUser)
		.then((user_id) =>
			noteSQL.addNotes(user_id[0].id, newNote).then(() => {
				res.redirect("/user/notes");
			})
		)
		.catch((err) => res.status(500).json(err));
});

app.put("/user/notes/:id", (req, res) => {
	console.log("editing note");
	let updateNote = req.body.update;
	let updateID = req.params.id;
	return noteSQL
		.updateNotes(updateNote, updateID)
		.then(() => {
			res.send("updated");
		})
		.catch((err) => res.status(500).json(err));
});

app.delete("/user/notes/:id", (req, res) => {
	console.log("deleting note");
	let deleteID = req.params.id;
	return noteSQL
		.delNotes(deleteID)
		.then(() => {
			res.send("deleted");
		})
		.catch((err) => res.status(500).json(err));
});

app.listen(port, () => {
	console.log("Running on port ", port);
});

module.exports = app;
