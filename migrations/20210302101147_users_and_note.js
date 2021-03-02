exports.up = function (knex) {
	return knex.schema
		.createTable("users", (table) => {
			table.increments();
			table.string("username").notNull();
			table.string("password").notNull();
			table.timestamps(true, true);
		})
		.then(() => {
			return knex.schema.createTable("notes", (table) => {
				table.increments();
				table.string("notes").notNull();
				table.integer("user_id").unsigned();
				table.foreign("user_id").references("users.id");
				table.timestamps(true, true);
			});
		});
};

exports.down = function (knex) {
	return knex.schema.dropTable("notes").then(() => {
		knex.schema.dropTable("users");
	});
};
