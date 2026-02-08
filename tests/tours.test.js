const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("./app-test"); // Your Express app
const api = supertest(app);
const Tour = require("../models/tourModel");

const tours = [
  {
    name: "Helsinki in 5 Days Tour",
    info: "Discover the charm of Helsinki in 5 days with our expert guides.",
    image: "https://www.course-api.com/images/tours/tour-1.jpeg",
    price: "1900",
    duration: "5 days",
    rating: 4.5,
    season: "Summer",
    specialOffer: "10% off for early bookings",
  },
  {
    name: "London in 7 Days Tour",
    info: "Explore the best of London in 7 days with our expert guides.",
    image: "https://www.course-api.com/images/tours/tour-2.jpeg",
    price: "2195",
    duration: "7 days",
    rating: 4.8,
    season: "Spring",
    specialOffer: "Group discount available",
  },
];

describe("Tour API", () => {
  beforeEach(async () => {
    Tour.getAll().forEach((tour) => Tour.deleteOneById(tour.id));
    tours.forEach((tour) => Tour.addOne(tour));
  });

  afterAll(() => {
    mongoose.connection.close();
  });

  describe("GET /api/tours", () => {
    it("should return all tours with HTTP 200 status", async () => {
      const response = await api
        .get("/api/tours")
        .expect(200)
        .expect("Content-Type", /application\/json/);

      expect(response.body).toHaveLength(tours.length);
    });

    it("should return tours in JSON format", async () => {
      const response = await api
        .get("/api/tours")
        .expect("Content-Type", /application\/json/);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("POST /api/tours", () => {
    it("should create a new tour and return HTTP 201 status", async () => {
      const newTour = {
        name: "Stockholm in 6 Days Tour",
        info: "Explore the best of Stockholm in 6 days with our expert guides.",
        image: "https://www.course-api.com/images/tours/tour-3.jpeg",
        price: "1700",
        duration: "6 days",
        rating: 4.7,
        season: "Winter",
        specialOffer: "Holiday special discount",
      };

      const response = await api
        .post("/api/tours")
        .send(newTour)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      expect(response.body.name).toBe(newTour.name);
    });

    it("should add the new tour to the collection", async () => {
      const newTour = {
        name: "Paris in 4 Days Tour",
        info: "Experience the beauty of Paris.",
        image: "https://www.course-api.com/images/tours/tour-4.jpeg",
        price: "1500",
        duration: "4 days",
        rating: 4.9,
        season: "Spring",
        specialOffer: "Couples package",
      };

      await api.post("/api/tours").send(newTour).expect(201);

      const toursAfterPost = Tour.getAll();
      expect(toursAfterPost).toHaveLength(tours.length + 1);
      const tourNames = toursAfterPost.map((tour) => tour.name);
      expect(tourNames).toContain(newTour.name);
    });
  });

  describe("GET /api/tours/:id", () => {
    it("should return a tour by its ID with HTTP 200 status", async () => {
      const tour = Tour.getAll()[0];
      const response = await api
        .get(`/api/tours/${tour.id}`)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      expect(response.body.id).toBe(tour.id);
    });

    it("should return HTTP 404 when tour ID does not exist", async () => {
      const nonExistentId = 9999;
      await api.get(`/api/tours/${nonExistentId}`).expect(404);
    });
  });

  describe("PUT /api/tours/:id", () => {
    it("should update a tour with partial data and return HTTP 200 status", async () => {
      const tour = Tour.getAll()[0];
      const updatedTour = {
        info: "Updated info",
        price: "2500",
      };

      const response = await api
        .put(`/api/tours/${tour.id}`)
        .send(updatedTour)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      expect(response.body.info).toBe(updatedTour.info);
      expect(response.body.price).toBe(updatedTour.price);
    });

    it("should persist the updated tour in the database", async () => {
      const tour = Tour.getAll()[0];
      const updatedTour = {
        info: "Verified updated info",
      };

      await api.put(`/api/tours/${tour.id}`).send(updatedTour).expect(200);

      const updatedTourCheck = Tour.findById(tour.id);
      expect(updatedTourCheck.info).toBe(updatedTour.info);
    });

    it("should return HTTP 400 when tour ID is invalid", async () => {
      const invalidId = "invalid-id";
      await api.put(`/api/tours/${invalidId}`).send({}).expect(400);
    });
  });

  describe("DELETE /api/tours/:id", () => {
    it("should delete a tour and return HTTP 204 status", async () => {
      const tour = Tour.getAll()[0];
      await api.delete(`/api/tours/${tour.id}`).expect(204);
    });

    it("should remove the tour from the database", async () => {
      const tour = Tour.getAll()[0];
      await api.delete(`/api/tours/${tour.id}`).expect(204);

      const deletedTourCheck = Tour.findById(tour.id);
      expect(deletedTourCheck).toBeFalsy();
    });

    it("should return HTTP 400 when tour ID is invalid", async () => {
      const invalidId = "invalid-id";
      await api.delete(`/api/tours/${invalidId}`).expect(400);
    });
  });
});
