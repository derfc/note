const app = require("../app");
const request = require("supertest");
// let response;

describe("Routes", () => {
	test("/ should return index", (done) => {
		request(app)
			.get("/")
			.expect(200)
			.expect("content-type", /html/)
			.end((err, res) => {
				if (err) throw err;
				done();
			});
	});

	test("/user/notes should return user's home page", (done) => {
		request(app)
			.get("/users/notes")
			.expect(200)
			.expect("content-type", /html/)
			.end((err, res) => {
				if (err) throw err;
				done();
			});
	});

	test("should fail if endpoint not found", (done) => {
		request(app)
			.get("/hello")
			.expect(404)
			.expect("content-type", /html/)
			.end((err, res) => {
				if (err) throw err;
				done();
			});
	});
});
