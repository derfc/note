exports.seed = function (knex) {
	// Deletes ALL existing entries
	return knex("notes")
		.del()
		.then(function () {
			// Inserts seed entries
			return knex("notes").insert([
				{ id: 1, notes: "Hello World!!!", user_id: 1 },
			]);
		});
};
