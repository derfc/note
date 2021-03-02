const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const NoteSQL = require("./notesql");
const UserSQL = require("./usersql");
const hb = require("express-handlebars");
const bcrypt = require("bcrypt");
const port = 8080;
const app = express();
app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("public"));
app.engine("handlebars", hb({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
let noteSQL = new NoteSQL("notes");
let userSQL = new UserSQL("users");
let currentUser;

app.get("/", (req, res) => {
	currentUser = "";
	try {
		res.status(200).render("index");
	} catch (err) {
		res.status(500).send();
	}
});

app.post("/", async (req, res) => {
	console.log("login");
	let userName = req.body.username;
	let checkUser = userSQL.selectUser(userName);
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
				await userSQL.insert(userName, hashedPassword);
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
	if (currentUser) {
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
	} else {
		res.send("please login").catch((err) => res.status(500).json(err));
	}
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
