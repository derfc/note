const app = require("../working");
const request = require("supertest");

describe("Routes", () => {
	test("/user should return users page", (done) => {
		request(app)
			.get("/users")
			.expect(200)
			.expect("content-type", /json/)
			.end((err, res) => {
				if (err) throw err;
				done();
			});
	});

	test("/user/bitch should return bitch's page", (done) => {
		request(app)
			.get("/users/bitch")
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
