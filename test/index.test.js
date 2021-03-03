// const app = require("../app");
const app = "http://localhost:8080";
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

	test("/user/notes should return user's home page if user is not null", (done) => {
		var auth = "Basic c2FtOjEyMw==";
		request(app)
			.get("/users/notes")
			.set("Authorization", auth)
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
