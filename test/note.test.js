"use strict";
const Note = require("../note");
const fs = require("fs");
const file = `./test.json`;

describe("Note with properfile", () => {
	beforeEach((done) => {
		fs.unlink(file, (err) => {
			if (err) {
				console.log(err);
				this.note = new Note(file);
			}
			this.note = new Note(file);
			done();
		});
	});

	test("at first should list empty notes", () => {
		return this.note.list().then((notes) => expect(notes).toEqual({}));
	});

	test("should be able to add note to a file", () => {
		return this.note
			.add("hello", "Tronald Dump")
			.then(() => this.note.list())
			.then((notes) => {
				expect(notes).toEqual({ "Tronald Dump": ["hello"] });
			});
	});

	test("should be able to update note", () => {
		return this.note.add("hello", "Tronald Dump").then(() => {
			this.note
				.update("Tronald Dump", 0, "byebye")
				.then(() => this.note.read())
				.then((notes) => {
					expect(notes).toEqual({ "Tronald Dump": ["byebye"] });
				});
		});
	});

	test("should be able to remove note", () => {
		return this.note.add("byebye", "Tronald Dump").then(() => {
			this.note.remove("Tronald Dump", 0).then(() =>
				this.note.read().then((notes) => {
					expect(notes).toEqual({ "Tronald Dump": [] });
				})
			);
		});
	});
});
