const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("./app-test"); // Your Express app
const api = supertest(app);
const User = require("../models/userModel");

const users = [
  {
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    phone_number: "1234567890",
    gender: "Male",
    date_of_birth: "1990-01-01",
    membership_status: "Inactive",
    account_verified: true,
    company: "Tech Corp",
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    password: "password456",
    phone_number: "0987654321",
    gender: "Female",
    date_of_birth: "1992-05-15",
    membership_status: "Inactive",
    account_verified: false,
    company: "Design Studio",
  },
];

describe("User API", () => {
  beforeEach(() => {
    User.getAll().forEach((user) => User.deleteOneById(user.id));
    users.forEach((user) => User.addOne(user));
  });

  afterAll(() => {
    mongoose.connection.close();
  });

  describe("GET /api/users", () => {
    it("should return all users with HTTP 200 status", async () => {
      const response = await api
        .get("/api/users")
        .expect(200)
        .expect("Content-Type", /application\/json/);

      expect(response.body).toHaveLength(users.length);
    });

    it("should return users in JSON format", async () => {
      const response = await api
        .get("/api/users")
        .expect("Content-Type", /application\/json/);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("POST /api/users", () => {
    it("should create a new user and return HTTP 201 status", async () => {
      const newUser = {
        name: "Alice Johnson",
        email: "alice@example.com",
        password: "password789",
        phone_number: "1112223333",
        gender: "Female",
        date_of_birth: "1993-03-22",
        membership_status: "Active",
        account_verified: true,
        company: "Marketing Inc",
      };

      const response = await api
        .post("/api/users")
        .send(newUser)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      expect(response.body.email).toBe(newUser.email);
    });

    it("should add the new user to the collection", async () => {
      const newUser = {
        name: "Bob Wilson",
        email: "bob@example.com",
        password: "password999",
        phone_number: "2223334444",
        gender: "Male",
        date_of_birth: "1991-08-10",
        membership_status: "Active",
        account_verified: true,
        company: "Tech Solutions",
      };

      await api.post("/api/users").send(newUser).expect(201);

      const usersAfterPost = User.getAll();
      expect(usersAfterPost).toHaveLength(users.length + 1);
      const emails = usersAfterPost.map((user) => user.email);
      expect(emails).toContain(newUser.email);
    });

    it("should reject user creation with duplicate email and return HTTP 400 status", async () => {
      const duplicateUser = {
        name: "Duplicate User",
        email: "john@example.com",
        password: "password123",
        phone_number: "5555555555",
        gender: "Male",
        date_of_birth: "1995-07-19",
        membership_status: "Active",
        account_verified: true,
        company: "Duplicate Co",
      };

      const response = await api
        .post("/api/users")
        .send(duplicateUser)
        .expect(400);

      expect(response.body.message).toBe("Failed to create user");
    });

    it("should not add a duplicate user to the collection", async () => {
      const duplicateUser = {
        name: "Duplicate User",
        email: "john@example.com",
        password: "password123",
        phone_number: "5555555555",
        gender: "Male",
        date_of_birth: "1995-07-19",
        membership_status: "Active",
        account_verified: true,
        company: "Duplicate Co",
      };

      await api.post("/api/users").send(duplicateUser).expect(400);

      const usersAfterPost = User.getAll();
      expect(usersAfterPost).toHaveLength(users.length);
    });
  });

  describe("GET /api/users/:id", () => {
    it("should return a user by their ID with HTTP 200 status", async () => {
      const user = User.getAll()[0];
      const response = await api
        .get(`/api/users/${user.id}`)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      expect(response.body.id).toBe(user.id);
    });

    it("should return HTTP 404 when user ID does not exist", async () => {
      const nonExistentId = 9999;
      await api.get(`/api/users/${nonExistentId}`).expect(404);
    });
  });

  describe("PUT /api/users/:id", () => {
    it("should update a user with partial data and return HTTP 200 status", async () => {
      const user = User.getAll()[0];

      const updatedFields = {
        phone_number: "9876543210",
        membership_status: "Active",
      };

      const response = await api
        .put(`/api/users/${user.id}`)
        .send(updatedFields)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      expect(response.body.phone_number).toBe(updatedFields.phone_number);
      expect(response.body.membership_status).toBe(updatedFields.membership_status);
    });

    it("should persist the updated user in the database", async () => {
      const user = User.getAll()[0];

      const updatedFields = {
        phone_number: "9876543210",
        membership_status: "Active",
      };

      await api.put(`/api/users/${user.id}`).send(updatedFields).expect(200);

      const updatedUserCheck = User.findById(user.id);
      expect(updatedUserCheck.phone_number).toBe(updatedFields.phone_number);
      expect(updatedUserCheck.membership_status).toBe(updatedFields.membership_status);
    });

    it("should return HTTP 400 when user ID is invalid", async () => {
      const invalidId = "invalid-id";
      await api.put(`/api/users/${invalidId}`).send({}).expect(400);
    });
  });

  describe("DELETE /api/users/:id", () => {
    it("should delete a user and return HTTP 204 status", async () => {
      const user = User.getAll()[0];
      await api.delete(`/api/users/${user.id}`).expect(204);
    });

    it("should remove the user from the database", async () => {
      const user = User.getAll()[0];
      await api.delete(`/api/users/${user.id}`).expect(204);

      const deletedUserCheck = User.findById(user.id);
      expect(deletedUserCheck).toBeFalsy();
    });

    it("should return HTTP 400 when user ID is invalid", async () => {
      const invalidId = "invalid-id";
      await api.delete(`/api/users/${invalidId}`).expect(400);
    });
  });
});
