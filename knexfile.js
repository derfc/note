// Update with your config settings.
require("dotenv").config();
module.exports = {
	development: {
		client: "postgresql",
		connection: {
			database: process.env.db_name,
			user: process.env.db_username,
			password: process.env.db_password,
		},
		pool: {
			min: 2,
			max: 10,
		},
		migrations: {
			tableName: "knex_migrations",
		},
	},

	staging: {
		client: "postgresql",
		connection: {
			database: process.env.db_name,
			user: process.env.db_username,
			password: process.env.db_password,
		},
		pool: {
			min: 2,
			max: 10,
		},
		migrations: {
			tableName: "knex_migrations",
		},
	},

	production: {
		client: "postgresql",
		connection: {
			database: process.env.db_name,
			user: process.env.db_username,
			password: process.env.db_password,
		},
		pool: {
			min: 2,
			max: 10,
		},
		migrations: {
			tableName: "knex_migrations",
		},
	},
};
