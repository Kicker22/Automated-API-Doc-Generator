const request = require("supertest");
const app = require("../apiParser"); // Ensure this is the correct path

describe("Users API", () => {
    it("should return a list of users", async () => {
        const res = await request(app).get("/users");
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("users");
    });

    it("should return a user by search", async () => {
        const res = await request(app).get("/users?search=Alice");
        expect(res.statusCode).toEqual(200);
        expect(res.body.users.length).toBeGreaterThan(0);
    });
});
