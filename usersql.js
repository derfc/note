require("dotenv").config();
const knex = require("knex")({
	client: "postgresql",
	connection: {
		database: process.env.db_name,
		user: process.env.db_username,
		password: process.env.db_password,
	},
});

module.exports = class UserSQL {
	constructor(user) {
		this.users = user;
	}

	selectUser(userName) {
		return knex(this.users).where("username", `${userName}`);
	}

	addUsers(userName, password) {
		return knex(this.users).insert({
			username: `${userName}`,
			password: `${password}`,
		});
	}

	updateUsers(updateUser, updateID) {
		// return knex(this.users).update("username", updateUser).where("id", updateID);
	}

	delUsers(deleteID) {
		// return knex(this.users).where("id", deleteID).del();
	}
};
