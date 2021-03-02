require("dotenv").config();
const knex = require("knex")({
	client: "postgresql",
	connection: {
		database: process.env.db_name,
		user: process.env.db_username,
		password: process.env.db_password,
	},
});

module.exports = class NoteSQL {
	constructor(notes) {
		this.notes = notes;
	}

	selectID(userName) {
		return knex.select("id").from("users").where("username", `${userName}`);
	}

	getNotes(user_id) {
		return knex(this.notes).where("user_id", user_id).orderBy("notes.id");
	}
	addNotes(user_id, newNote) {
		return knex(this.notes).insert({ notes: `${newNote}`, user_id: user_id });
	}

	updateNotes(updateNote, updateID) {
		return knex(this.notes).update("notes", updateNote).where("id", updateID);
	}

	delNotes(deleteID) {
		return knex(this.notes).where("id", deleteID).del();
	}
};
