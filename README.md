# Backend Database Integration (Beginner-Friendly)

## Overview

In this paired activity, you will collaboratively migrate your existing MVC API to use MongoDB. You'll start with in-memory data and progressively move to a real database, learning environment variables, error handling, and cloud deployment along the way.

There are two parts to this lab:
- **Part 1: MVC with Database** (required for all students)
- **Part 2: AI Integration** (primarily for students implementing AI in their group projects)

---

## How you will work (paired, not strict pair programming)

Some students feel nervous about "strict" pair programming. That's totally ok. For this activity, you will work as **two problem-solvers**:

- You can both talk, think, and type.
- Your goal is to **try together first**, then reveal help only if you need it.
- Each iteration below has a hidden solution you can expand/collapse.

Example format you will see:

```html
<details>
<summary>Solution</summary>

...hidden help here...

</details>
```

### Help ladder (use in order)

When you get stuck:

1. Re-read the instruction and the code you're changing.
2. Ask your partner to explain their approach.
3. Try a tiny experiment (change one thing, retest).
4. Open the solution for that micro-step.
5. Ask the teacher.

### Recommended rhythm

- After each micro-step, the app should still run.
- Commit after each micro-step with a clear message.
- Switch roles (driver ↔ navigator) after each major iteration.

### This is a 3-hour lab

- Part 1:
  - Iteration 0 (setup + verify starter)
  - Iteration 1 (environment variables)
  - Iteration 2 (AI config)
  - Iteration 3 (tours + MongoDB)
  - Iteration 4 (users + MongoDB)
  - Iteration 5 (error handling)
  - Iteration 6 (MongoDB Atlas)
- Part 2: AI Integration (primarily for students implementing AI in their group projects)

If you're behind: keep going in order, but do the **minimum working version** for each micro-step before moving on.

### Required discussion checkpoints

After every micro-step below, pause for 60–90 seconds:

- Partner A explains: "What did we change and why?"
- Partner B points to the exact file and line area.
- Both predict what Postman should return **before** testing.

If you can't explain it, don't move on yet.

### Commit messages (best-practice, beginner-friendly)

Use small commits that describe *what* changed.

Recommended format (Conventional Commits style):

- `feat(tours): add MongoDB schema`
  - *feat* = Short for feature. Used when you add new functionality.
- `refactor(tours): replace in-memory data with database`
  - *refactor* = Change existing code without altering behavior (improves structure/readability).
- `chore: configure dotenv for environment management`
  - *chore* = Maintenance tasks that don't change application behavior (dependencies, config, logging).

Rule of thumb:

- One commit = one "idea" that you could explain quickly.
- If a commit breaks the app, it's too big.

### Note about the sample solutions

The solutions in this lab are written to be **readable and beginner-friendly**.

- They are not always the most "perfect" architecture.
- If you want to improve them later (great idea!), you can refactor toward stronger validation, cleaner structure, and more reusable patterns.

---

## Prerequisites

Before starting, ensure you have **MongoDB installed locally**:
  - Open MongoDB Compass and connect to `mongodb://localhost:27017`
  - If the connection succeeds, MongoDB is running correctly
  - If the connection fails, start MongoDB using:
    - **Windows**: Start MongoDB service from the Services app
    - **macOS/Linux**: Run `sudo systemctl start mongod` or `brew services start mongodb-community`

---

## Instructions

### Iteration 0: Setup and Verify Starter Code

**Goal:** Get a working local server + GitHub repo so you can iterate safely.

**Try it first:**

Before you change anything, confirm the starter code runs and you can make API requests.

#### Guided micro-steps

**Step 0A — Decide Initial Roles**

- Determine who will start as the driver and who will be the navigator.
- Remember to switch roles after each major iteration.

**Discuss:** What's the difference between driver and navigator?

**Step 0B — Clone the Starter Repository**

Clone the repository and remove the Git history so you can start fresh:

**Git Bash / macOS / Linux:**

```bash
git clone https://github.com/tx00-resources-en/w5-bepp-starter week5-be-pp-option-b
cd week5-be-pp-option-b
rm -rf .git
```

**Windows PowerShell:**

```powershell
git clone https://github.com/tx00-resources-en/w5-bepp-starter week5-be-pp-option-b
Set-Location week5-be-pp-option-b
Remove-Item -Recurse -Force .git
```

**Discuss:** Why do we remove the `.git` directory?

<details>
<summary>Solution (Step 0B)</summary>

Removing the `.git` directory deletes the existing Git history. This allows you to:
- Start with a fresh commit history for your new repository
- Avoid conflicts with the original starter repo
- Track your own changes from the beginning

</details>

**Step 0C — Install Dependencies and Run the Server**

Install packages and start the development server:

```bash
npm install
npm run dev
```

**Discuss:** What does `npm run dev` do? Where is it defined?

<details>
<summary>Solution (Step 0C)</summary>

`npm run dev` executes the `dev` script defined in `package.json`. It typically runs:

```json
"scripts": {
  "dev": "nodemon app.js"
}
```

`nodemon` automatically restarts the server when you save file changes.

</details>

**Step 0D — Test the API with Postman**

Before making any changes, verify the existing endpoints work:

**Postman tests:**

- `GET http://localhost:4000/tours` → expect `200` and an array of tours
- `GET http://localhost:4000/users` → expect `200` and an array of users

If these don't work, **stop and debug** before moving on.

**Discuss:** What status code means "success"? What's the difference between 200, 201, and 204?

<details>
<summary>Solution (Step 0D)</summary>

Common HTTP status codes:
- `200 OK` — Successful GET, PUT, or general success
- `201 Created` — Successful POST (new resource created)
- `204 No Content` — Successful DELETE (no body returned)
- `404 Not Found` — Resource doesn't exist
- `500 Internal Server Error` — Server-side error

</details>

**Step 0E — Initialize Git and Push to GitHub**

1. Create a new repository on GitHub (example name: `week5-be-pp-option-b`)
2. Add your partner as a collaborator
3. Initialize Git locally and push:

```bash
git init
git add .
git commit -m "chore: initialize project structure and repository"
git remote add origin <your-repo-url>
git push -u origin main
```

**Discuss:** What does `git remote add origin` do?

**Commit:** `chore: initialize project structure and repository`

<details>
<summary>Solution (Step 0E)</summary>

Key Git commands:
- `git init` — Creates a new Git repository in the current directory
- `git remote add origin <url>` — Links your local repo to a GitHub repository
- `git push -u origin main` — Uploads your commits to GitHub and sets `main` as the default branch

</details>

---

### Iteration 1: Using Environment Variables with `.env`

**Goal:** Move configuration (port, database URI) into environment variables for better security and flexibility.

**Try it first:**

Before you start:
1. Look at `.env.example` to see what variables you need
2. Create your own `.env` file
3. Use `dotenv` to load those variables into your app

#### Guided micro-steps

**Step 1A — Copy the Example Environment File**

- Copy `.env.example` to `.env`:

```bash
# Bash/macOS/Linux
cp .env.example .env

# Windows PowerShell
Copy-Item .env.example .env
```

- Open `.env` and review its contents

**Discuss:** What kind of data should go in environment variables?

<details>
<summary>Solution (Step 1A)</summary>

Your `.env` file should look like:

```env
GEMINI_API_KEY=Jh6AIvfYH87KKL34KllmsHg
DEBUG_GEMINI=false
PORT=4000
MONGO_URI=mongodb://localhost:27017/w5-bepp
```

Environment variables are perfect for:
- API keys and secrets
- Database connection strings
- Port numbers
- Configuration that changes between environments (dev/test/production)

</details>

**Step 1B — Add `.env` to `.gitignore`**

- Open `.gitignore` and verify `.env` is listed:

```
node_modules/
.env
```

**Discuss:** Why should `.env` never be committed to Git?

**Commit:** `chore: configure gitignore for environment files`

<details>
<summary>Solution (Step 1B)</summary>

Never commit `.env` because it contains:
- Sensitive credentials (API keys, passwords)
- Environment-specific configuration
- Data that could be exploited if made public

Always commit `.env.example` (with placeholder values) so others know what variables are needed.

</details>

**Step 1C — Install `dotenv`**

Install the package that loads environment variables:

```bash
npm install dotenv
```

**Discuss:** What does a package like `dotenv` do under the hood?

**Commit:** `chore: install dotenv package`

<details>
<summary>Solution (Step 1C)</summary>

`dotenv` reads your `.env` file and adds each variable to `process.env`, making them accessible throughout your Node.js application.

</details>

**Step 1D — Configure `dotenv` in `app.js`**

- Open `app.js`
- Add this line **at the very top** (before any other requires):

```js
require('dotenv').config();
```

- Update the port configuration:

```js
const port = process.env.PORT || 4000;
```

**Discuss:** Why must `dotenv.config()` be called first?

**Commit:** `chore: configure dotenv in app.js`

<details>
<summary>Solution (Step 1D)</summary>

Example `app.js` top section:

```js
require('dotenv').config();
const express = require('express');
const app = express();

const port = process.env.PORT || 4000;
```

`dotenv.config()` must run first so environment variables are available when other modules load.

</details>

**Step 1E — Update Database Configuration**

- Open `config/db.js`
- Replace the hardcoded MongoDB URI with the environment variable:

```js
mongoose.connect(process.env.MONGO_URI);
```

**Discuss:** What happens if `process.env.MONGO_URI` is undefined?

**Commit:** `chore: use environment variable for database URI`

<details>
<summary>Solution (Step 1E)</summary>

Complete `config/db.js`:

```js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
```

If `MONGO_URI` is undefined, Mongoose will throw an error. Always check your `.env` file is properly configured.

</details>

**Step 1F — Restart and Verify**

- Stop your server (if running)
- Restart: `npm run dev`
- Test: `GET http://localhost:4000/tours`

**Postman test:** `GET http://localhost:4000/tours` → should still work

**Discuss:** Why did we need to restart the server?

<details>
<summary>Solution (Step 1F)</summary>

Environment variables are loaded once when the server starts. Changes to `.env` require a server restart to take effect.

Note: Some tools like `nodemon` can be configured to restart on `.env` changes, but by default you must restart manually.

</details>

---

### Iteration 2: Configure AI Integration

**Goal:** Add your Google AI API key to environment variables and test the AI endpoint.

**Try it first:**

1. Get your Google AI API key
2. Add it to `.env`
3. Restart the server
4. Test the `/ai/tour-suggestions` endpoint

#### Guided micro-steps

**Step 2A — Add AI API Key to `.env`**

- Stop the server (environment changes require restart)
- Open `.env` and add:

```env
GOOGLE_AI_API_KEY=your-actual-api-key-here
```

**Discuss:** Where do you get a Google AI API key?

**Commit:** `chore: add Google AI API key to environment`

<details>
<summary>Solution (Step 2A)</summary>

To get a Google AI API key:
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy and paste it into your `.env` file

Your `.env` should now have:

```env
GOOGLE_AI_API_KEY=AIzaSyC...your-actual-key...
DEBUG_GEMINI=false
PORT=4000
MONGO_URI=mongodb://localhost:27017/w5-bepp
```

</details>

**Step 2B — Restart the Server**

```bash
npm run dev
```

**Discuss:** What would happen if you forgot to restart after changing `.env`?

<details>
<summary>Solution (Step 2B)</summary>

The old environment values would still be in memory. Your changes wouldn't take effect until restart.

</details>

**Step 2C — Test the AI Endpoint**

Use Postman to test the AI integration:

**Postman test:**

- **Method**: `POST`
- **URL**: `http://localhost:4000/ai/tour-suggestions`
- **Headers**: `Content-Type: application/json`
- **Body** (raw JSON):

```json
{
  "destination": "Tokyo",
  "duration": "5 days",
  "budget": "1500",
  "season": "Spring",
  "preferences": "food, culture, technology",
  "travelStyle": "guided tour"
}
```

**Expected response:** Markdown-formatted tour suggestions based on your input

**Discuss:** What happens if your API key is invalid?

**Commit:** `chore: verify AI endpoint configuration`

<details>
<summary>Solution (Step 2C)</summary>

If the API key is invalid, you'll get one of these errors:
- `401 Unauthorized` — Key is wrong or missing
- `403 Forbidden` — Key is valid but lacks permissions
- `429 Too Many Requests` — You've exceeded rate limits

If successful, you should receive AI-generated tour suggestions in Markdown format.

</details>

---

### Iteration 3: Refactor Tours API to Use MongoDB

**Goal:** Replace in-memory tour storage with a real MongoDB database.

**Try it first:**

This is a bigger iteration. You'll:
1. Connect to MongoDB
2. Create a Mongoose schema
3. Update controllers to use database methods
4. Test everything still works

#### Guided micro-steps

**Step 3A — Import and Call `connectDB()` in `app.js`**

- Open `app.js`
- Import the database connection:

```js
const connectDB = require('./config/db');
```

- Call `connectDB()` after creating the app:

```js
const app = express();
connectDB(); // Add this line
```

**Discuss:** When should the database connection be established?

**Commit:** `feat(db): connect to MongoDB on server start`

<details>
<summary>Solution (Step 3A)</summary>

Example `app.js` structure:

```js
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(express.json());

// ... rest of your app
```

The database connection should be established early, but after `dotenv.config()`.

</details>

**Step 3B — Verify Database Connection**

- Restart your server: `npm run dev`
- Look for console message: `"MongoDB connected successfully"`
- If you see an error, verify:
  - MongoDB is running locally
  - `MONGO_URI` in `.env` is correct

**Discuss:** What does `mongodb://localhost:27017/w5-bepp` mean?

<details>
<summary>Solution (Step 3B)</summary>

MongoDB URI breakdown:
- `mongodb://` — Protocol
- `localhost` — Server location (your computer)
- `27017` — Default MongoDB port
- `w5-bepp` — Database name (created automatically if it doesn't exist)

Common connection errors:
- "Failed to connect" → MongoDB isn't running
- "Authentication failed" → Wrong credentials (if using auth)
- "ECONNREFUSED" → Wrong port or MongoDB not installed

</details>

**Step 3C — Create the Tour Mongoose Schema**

- Open `models/tourModel.js`
- Replace the existing in-memory code with a Mongoose schema:

**Try writing the schema yourself first**, then check the solution.

**Discuss:** What's the difference between a "schema" and a "model" in Mongoose?

**Commit:** `feat(models): add Tour Mongoose schema`

<details>
<summary>Solution (Step 3C)</summary>

Complete `models/tourModel.js`:

```js
const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  info: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: String, // kept as string since data uses "1,450"
    required: true,
  },
  duration: {
    type: String, // e.g. "5 days"
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
  },
  season: {
    type: String,
    required: true,
  },
  specialOffer: {
    type: String,
    required: true,
  },
}, {
  timestamps: true // adds createdAt and updatedAt automatically
});

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
```

Key concepts:
- **Schema** — Defines the structure and rules for documents
- **Model** — A class for creating and querying documents
- `timestamps: true` — Automatically adds `createdAt` and `updatedAt`

</details>

**Step 3D — Update `getAllTours` Controller**

- Open `controllers/tourControllers.js`
- Find the `getAllTours` function
- Replace the in-memory logic with Mongoose `.find()`:

**Try it first:** What Mongoose method retrieves all documents?

**Discuss:** Why do we use `.sort({ createdAt: -1 })`?

**Commit:** `refactor(controllers): use database in getAllTours`

<details>
<summary>Solution (Step 3D)</summary>

Updated `getAllTours`:

```js
const getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find().sort({ createdAt: -1 });
    res.json(tours);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

Key changes:
- Added `async` keyword (database operations are asynchronous)
- Used `await Tour.find()` instead of in-memory array
- `.sort({ createdAt: -1 })` sorts newest-first (-1 = descending)
- Added `try/catch` for error handling

</details>

**Step 3E — Test `getAllTours` with Postman**

**Postman test:** `GET http://localhost:4000/tours`

**Expected:**
- `200` status code
- Empty array `[]` (database is empty initially)

**If it fails**, check:
- Server is running
- MongoDB connection succeeded
- No syntax errors in controller

**Discuss:** Why is the array empty even though the old in-memory data had tours?

<details>
<summary>Solution (Step 3E)</summary>

The database is empty because:
- We switched from in-memory storage to MongoDB
- MongoDB is a separate database server
- No tours have been created in the database yet

You can add tours using the `POST` endpoint (which we'll update next).

</details>

**Step 3F — Update `createTour` Controller**

- Find the `createTour` function
- Replace in-memory logic with `Tour.create()`:

**Try it first:** What Mongoose method creates a new document?

**Commit:** `refactor(controllers): use database in createTour`

<details>
<summary>Solution (Step 3F)</summary>

Updated `createTour`:

```js
const createTour = async (req, res) => {
  try {
    const { name, info, image, price, duration, rating, season, specialOffer } = req.body;

    const newTour = await Tour.create({
      name,
      info,
      image,
      price,
      duration,
      rating,
      season,
      specialOffer,
    });

    res.status(201).json(newTour);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
```

Key changes:
- Used `await Tour.create()` instead of pushing to array
- Returns `201` status for successful creation
- Mongoose automatically validates required fields

</details>

**Step 3G — Test `createTour` with Postman**

**Postman test:**

- **Method**: `POST`
- **URL**: `http://localhost:4000/tours`
- **Body** (raw JSON):

```json
{
  "name": "Adventures in Tokyo - 5 Day Tour",
  "info": "Discover the vibrant mix of tradition and modernity in Tokyo. Visit ancient temples like Senso-ji, explore futuristic districts such as Shibuya and Akihabara, and enjoy authentic Japanese cuisine from sushi to ramen.",
  "image": "https://tx00-web-en.github.io/resources/img/tours/tour-2.jpeg",
  "price": "1,450",
  "duration": "5 days",
  "rating": 4.8,
  "season": "Spring 2027",
  "specialOffer": "Early bird discount 10%"
}
```

**Expected:**
- `201` status code
- Tour object with `_id`, `createdAt`, `updatedAt`

**Discuss:** What's the `_id` field? Where did it come from?

<details>
<summary>Solution (Step 3G)</summary>

MongoDB automatically generates:
- `_id` — Unique identifier (ObjectId)
- `createdAt` — Timestamp when document was created (from `timestamps: true`)
- `updatedAt` — Timestamp when document was last modified

Example response:

```json
{
  "_id": "6735b3e2f9a1c9d123456789",
  "name": "Adventures in Tokyo - 5 Day Tour",
  "info": "Discover the vibrant mix...",
  "image": "https://tx00-web-en.github.io/resources/img/tours/tour-2.jpeg",
  "price": "1,450",
  "duration": "5 days",
  "rating": 4.8,
  "season": "Spring 2027",
  "specialOffer": "Early bird discount 10%",
  "createdAt": "2025-11-14T16:40:00.000Z",
  "updatedAt": "2025-11-14T16:40:00.000Z",
  "__v": 0
}
```

</details>

**Step 3H — Update `getTourById` Controller**

- Find the `getTourById` function
- Replace with `Tour.findById()`:

**Try it first:** What happens if the ID doesn't exist?

**Commit:** `refactor(controllers): use database in getTourById`

<details>
<summary>Solution (Step 3H)</summary>

Updated `getTourById`:

```js
const getTourById = async (req, res) => {
  try {
    const { tourId } = req.params;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(tourId)) {
      return res.status(400).json({ message: 'Invalid tour ID format' });
    }

    const tour = await Tour.findById(tourId);

    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }

    res.json(tour);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

Important additions:
- `mongoose.Types.ObjectId.isValid()` checks if ID format is valid
- Returns `400` for invalid format, `404` for not found
- Don't forget to import `mongoose` at the top of the file

</details>

**Step 3I — Test `getTourById` with Postman**

First, create a tour (Step 3G), then copy its `_id`.

**Postman test:**

- `GET http://localhost:4000/tours/<paste-id-here>`

**Expected:**
- `200` status code
- The tour object

**Also test:**
- Invalid ID: `GET http://localhost:4000/tours/invalid-id` → `400`
- Non-existent ID: `GET http://localhost:4000/tours/673500000000000000000000` → `404`

**Discuss:** Why do we need to validate the ID format separately?

<details>
<summary>Solution (Step 3I)</summary>

MongoDB ObjectIds have a specific format (24 hex characters). If the format is wrong, Mongoose throws an error.

Validating first:
- Provides better error messages to the client
- Prevents unnecessary database queries
- Returns appropriate status code (400 vs 500)

</details>

**Step 3J — Update `updateTour` Controller**

- Find the `updateTour` function
- Replace with `Tour.findByIdAndUpdate()`:

**Try it first:** What option makes `findByIdAndUpdate` return the updated document?

**Commit:** `refactor(controllers): use database in updateTour`

<details>
<summary>Solution (Step 3J)</summary>

Updated `updateTour`:

```js
const updateTour = async (req, res) => {
  try {
    const { tourId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(tourId)) {
      return res.status(400).json({ message: 'Invalid tour ID format' });
    }

    const updatedTour = await Tour.findByIdAndUpdate(
      tourId,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedTour) {
      return res.status(404).json({ message: 'Tour not found' });
    }

    res.json(updatedTour);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
```

Important options:
- `{ new: true }` — Returns the updated document (not the old one)
- `{ runValidators: true }` — Runs schema validation on update

</details>

**Step 3K — Test `updateTour` with Postman**

**Postman test:**

- **Method**: `PUT`
- **URL**: `http://localhost:4000/tours/<tour-id>`
- **Body** (raw JSON):

```json
{
  "price": "2,295"
}
```

**Expected:**
- `200` status code
- Updated tour with new price
- `updatedAt` timestamp should change

**Discuss:** Why can we send only the fields we want to update?

<details>
<summary>Solution (Step 3K)</summary>

`findByIdAndUpdate` performs a partial update:
- Only fields in `req.body` are updated
- Other fields remain unchanged
- This is RESTful behavior for PUT/PATCH operations

Example response shows `price` changed but `name`, `info`, etc. stayed the same.

</details>

**Step 3L — Update `deleteTour` Controller**

- Find the `deleteTour` function
- Replace with `Tour.findByIdAndDelete()`:

**Try it first:** What status code should DELETE return?

**Commit:** `refactor(controllers): use database in deleteTour`

<details>
<summary>Solution (Step 3L)</summary>

Updated `deleteTour`:

```js
const deleteTour = async (req, res) => {
  try {
    const { tourId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(tourId)) {
      return res.status(400).json({ message: 'Invalid tour ID format' });
    }

    const deletedTour = await Tour.findByIdAndDelete(tourId);

    if (!deletedTour) {
      return res.status(404).json({ message: 'Tour not found' });
    }

    res.status(204).send(); // No content
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

Key points:
- Returns `204 No Content` on success
- `204` means success but no response body
- `.send()` with no arguments sends empty response

</details>

**Step 3M — Test `deleteTour` with Postman**

**Postman test:**

1. `DELETE http://localhost:4000/tours/<tour-id>`
   - Expected: `204` status, no body
2. `GET http://localhost:4000/tours/<same-id>`
   - Expected: `404` (tour no longer exists)

**Discuss:** Why does a successful DELETE return no body?

<details>
<summary>Solution (Step 3M)</summary>

`204 No Content` is the standard for successful DELETE because:
- The resource no longer exists
- There's nothing to return
- Client knows deletion succeeded from the status code alone

Some APIs return `200` with a success message, but `204` is more RESTful.

</details>

**Step 3N — Add Required Import at Top of Controller**

Make sure `controllers/tourControllers.js` has this at the top:

```js
const mongoose = require('mongoose');
const Tour = require('../models/tourModel');
```

**Commit:** `chore(controllers): add mongoose import for validation`

**Step 3O — Test All Tours Endpoints Together**

Run through the complete CRUD cycle:

1. `POST` — Create a tour
2. `GET` (all) — See it in the list
3. `GET` (by ID) — Retrieve specific tour
4. `PUT` — Update it
5. `DELETE` — Remove it
6. `GET` (by ID) — Confirm it's gone (404)

**If everything works, you're done with Iteration 3!**

**Discuss:** What's the biggest difference between in-memory and database storage?

<details>
<summary>Solution (Step 3O)</summary>

Key differences:

**In-memory storage:**
- Data lost when server restarts
- Fast (no network/disk I/O)
- Limited by RAM
- No querying capabilities

**Database storage:**
- Data persists across restarts
- Slower (network/disk I/O)
- Scalable (can store millions of records)
- Rich querying, indexing, relationships

</details>

---

### Iteration 4: Refactor Users API to Use MongoDB

**Goal:** Apply the same MongoDB migration to the users resource.

**Try it first:**

Use Iteration 3 as your template. You'll:
1. Create user schema
2. Update all user controllers
3. Test everything

This time, **try doing it with less help**. Only open solutions if you're stuck.

#### Guided micro-steps

**Step 4A — Create User Mongoose Schema**

- Open `models/userModel.js`
- Create a schema with these fields:
  - `name` (String, required)
  - `email` (String, required, unique)
  - `password` (String, required)
  - `phone_number` (String, required)
  - `gender` (String, enum: `['Male', 'Female', 'Other']`, required)
  - `date_of_birth` (Date, required)
  - `membership_status` (String, enum: `['Active', 'Inactive', 'Suspended']`, default: `'Active'`)
  - `account_verified` (Boolean, default: `false`)
  - `company` (String, optional)
- Enable timestamps

**Discuss:** What does `unique: true` on email do?

**Commit:** `feat(models): add User Mongoose schema`

<details>
<summary>Solution (Step 4A)</summary>

Complete `models/userModel.js`:

```js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // ensures no duplicate emails
  },
  password: {
    type: String,
    required: true,
  },
  phone_number: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'], // restricts to known values
    required: true,
  },
  date_of_birth: {
    type: Date,
    required: true,
  },
  membership_status: {
    type: String,
    enum: ['Active', 'Inactive', 'Suspended'],
    default: 'Active',
  },
  account_verified: {
    type: Boolean,
    default: false,
  },
  company: {
    type: String,
  },
}, {
  timestamps: true // adds createdAt and updatedAt automatically
});

const User = mongoose.model('User', userSchema);
module.exports = User;
```

`unique: true` creates a database index ensuring no two users can have the same email.

</details>

**Step 4B — Update All User Controllers**

Update these functions in `controllers/userControllers.js`:

1. `getAllUsers` → `User.find().sort({ createdAt: -1 })`
2. `createUser` → `User.create()`
3. `getUserById` → `User.findById()` (with validation)
4. `updateUser` → `User.findByIdAndUpdate()`
5. `deleteUser` → `User.findByIdAndDelete()`

**Try doing all five yourself** before checking the solution.

**Commit after each function:**
- `refactor(controllers): use database in getAllUsers`
- `refactor(controllers): use database in createUser`
- `refactor(controllers): use database in getUserById`
- `refactor(controllers): use database in updateUser`
- `refactor(controllers): use database in deleteUser`

<details>
<summary>Solution (Step 4B) — Complete userControllers.js</summary>

```js
const mongoose = require('mongoose');
const User = require('../models/userModel');

// GET all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST create user
const createUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone_number,
      gender,
      date_of_birth,
      membership_status,
      account_verified,
      company,
    } = req.body;

    const newUser = await User.create({
      name,
      email,
      password,
      phone_number,
      gender,
      date_of_birth,
      membership_status,
      account_verified,
      company,
    });

    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET user by ID
const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT update user
const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE user
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
};
```

</details>

**Step 4C — Test All User Endpoints**

Run the same CRUD cycle as tours:

**Postman tests:**

1. **POST** `http://localhost:4000/users`

```json
{
  "name": "Matti Seppänen",
  "email": "matti@example.com",
  "password": "M@45mtg$",
  "phone_number": "+358401234567",
  "gender": "Male",
  "date_of_birth": "2000-01-15",
  "membership_status": "Active",
  "account_verified": true,
  "company": "Nordic Travel Ltd"
}
```

2. **GET** `http://localhost:4000/users` → see the new user
3. **GET** `http://localhost:4000/users/<user-id>` → retrieve specific user
4. **PUT** `http://localhost:4000/users/<user-id>` with:

```json
{
  "membership_status": "Inactive"
}
```

5. **DELETE** `http://localhost:4000/users/<user-id>`
6. **GET** `http://localhost:4000/users/<user-id>` → `404`

**Discuss:** Why is the password returned in the response?

<details>
<summary>Solution (Step 4C)</summary>

> **Security Note**: Passwords are shown in these examples **for learning purposes only**. In production:
> - Passwords should **never** be returned in API responses
> - Passwords must be **hashed** before storage (using bcrypt)
> - Proper authentication will be covered in the upcoming security session

To hide password from responses, add this to your schema:

```js
password: {
  type: String,
  required: true,
  select: false, // Excludes from query results by default
},
```

Or use a Mongoose transform:

```js
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  }
});
```

</details>

---

### Iteration 5: Implement Error-Handling Middleware

**Goal:** Add centralized error handling to catch errors across all routes.

**Try it first:**

1. Review `middleware/customMiddleware.js`
2. Import and use both `unknownEndpoint` and `errorHandler` in `app.js`
3. Test with a deliberate error

#### Guided micro-steps

**Step 5A — Review the Existing Middleware**

- Open `middleware/customMiddleware.js`
- Read the `errorHandler` function

**Discuss:** What are the four parameters in error-handling middleware?

<details>
<summary>Solution (Step 5A)</summary>

Example `middleware/customMiddleware.js`:

```js
const unknownEndpoint = (req, res) => {
  res.status(404).json({ message: 'Unknown endpoint' });
};

const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  res.status(500).json({
    message: 'Something went wrong!',
  });
};

module.exports = { unknownEndpoint, errorHandler };
```

Error-handling middleware must have exactly **four parameters**:
1. `error` — The error object
2. `req` — Request object
3. `res` — Response object
4. `next` — Next middleware function

Express identifies error handlers by the four-parameter signature.

</details>

**Step 5B — Import Middleware in `app.js`**

- Open `app.js`
- Add near the top:

```js
const { unknownEndpoint, errorHandler } = require('./middleware/customMiddleware');
```

**Commit:** `chore(app): import custom middleware`

<details>
<summary>Solution (Step 5B)</summary>

Place this with other imports at the top of `app.js`:

```js
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const { unknownEndpoint, errorHandler } = require('./middleware/customMiddleware');
```

</details>

**Step 5C — Use Middleware in `app.js`**

Add the middleware **after all routes** but **before `app.listen()`**:

```js
// ... all your routes ...

// Use the unknownEndpoint middleware for handling undefined routes
app.use(unknownEndpoint);

// Use the errorHandler middleware for handling errors
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
```

**Discuss:** Why must error middleware come last?

**Commit:** `feat(middleware): add global error handling`

<details>
<summary>Solution (Step 5C)</summary>

Example `app.js` bottom section:

```js
// Routers
app.use('/tours', tourRouter);
app.use('/users', userRouter);
app.use('/ai', aiRouter);

// Error handling (must be last)
app.use(unknownEndpoint);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
```

Middleware order matters:
- Routes are tried first
- If no route matches → `unknownEndpoint` (404)
- If any route throws error → `errorHandler` (500)
- Error middleware must be last to catch all errors

</details>

**Step 5D — Test Unknown Endpoint**

**Postman test:**

- `GET http://localhost:4000/nonexistent-route`

**Expected:**
- `404` status
- `{ "message": "Unknown endpoint" }`

**Discuss:** What happens if a route is defined after `unknownEndpoint`?

<details>
<summary>Solution (Step 5D)</summary>

If you define routes after `unknownEndpoint`, they'll never be reached because:
1. Express processes middleware in order
2. `unknownEndpoint` responds to every unmatched route
3. Routes defined after it are unreachable

Always define `unknownEndpoint` and `errorHandler` last.

</details>

**Step 5E — Test Error Handler with Deliberate Error**

Add a test route in `app.js` (temporary, for testing only):

```js
// Example route that throws an error (for testing purposes only)
app.get('/error', (req, res, next) => {
  const error = new Error('Network problem');
  next(error);
});
```

**Postman test:**

- `GET http://localhost:4000/error`

**Expected:**
- `500` status
- `{ "message": "Something went wrong!" }`
- Console shows: `"Network problem"`

**Discuss:** How does `next(error)` trigger the error handler?

**Commit:** `test(middleware): add temporary error test route`

<details>
<summary>Solution (Step 5E)</summary>

How `next(error)` works:

1. When you call `next()` with an argument, Express treats it as an error
2. Express skips all normal middleware
3. Express jumps to the first error-handling middleware (4 parameters)
4. Error handler sends response

This is useful for:
- Database errors
- Validation errors
- External API failures
- Any unexpected errors

**Remember to remove the `/error` test route** when you're done testing!

</details>

**Step 5F — Remove Test Route**

Delete the `/error` route from `app.js`.

**Commit:** `chore(middleware): remove error test route`

---

### Iteration 6: Migrate to MongoDB Atlas (Cloud Database)

**Goal:** Move from local MongoDB to a cloud-hosted database.

**Try it first:**

1. Create a MongoDB Atlas account
2. Set up a free cluster
3. Get connection string
4. Update `.env`
5. Test

**Note:** Atlas cluster creation can take 10–30 minutes. You can do this as homework if needed.

#### Guided micro-steps

**Step 6A — Create MongoDB Atlas Account**

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Verify your email

**Discuss:** What's the difference between local MongoDB and Atlas?

<details>
<summary>Solution (Step 6A)</summary>

**Local MongoDB:**
- Runs on your computer
- Only accessible from your machine
- Manual backups
- Free but requires installation

**MongoDB Atlas (cloud):**
- Runs on MongoDB's servers
- Accessible from anywhere
- Automatic backups
- Free tier available (512MB storage)
- Managed service (patches, updates handled for you)

</details>

**Step 6B — Create a Free Cluster**

Follow the Atlas setup guide (you can refer to the original task.md or your instructor's guide).

Key steps:
1. Choose "Free Shared" cluster
2. Select cloud provider and region (nearest to you)
3. Name your cluster (e.g., "web-dev-cluster")
4. Click "Create Cluster"

**Wait for cluster to be ready** (shows green "Active" status)

**Discuss:** Why choose a region close to you?

<details>
<summary>Solution (Step 6B)</summary>

Region selection affects:
- **Latency** — Closer region = faster response times
- **Compliance** — Some data must stay in specific countries
- **Availability** — Not all regions offer free tier

For learning, choose the nearest free-tier region (e.g., Frankfurt for Europe).

</details>

**Step 6C — Create Database User**

1. In Atlas, go to "Database Access"
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `webdev` (or your choice)
5. Password: Generate a strong password (save it!)
6. Database User Privileges: "Read and write to any database"
7. Click "Add User"

**Discuss:** Why not use your Atlas account password?

<details>
<summary>Solution (Step 6C)</summary>

Separate database users for:
- **Security** — Limit blast radius if credentials leak
- **Access control** — Different apps can have different permissions
- **Auditing** — Track which app made which changes

Your Atlas account password is for the web interface.
Database user password is for application connections.

</details>

**Step 6D — Whitelist Your IP Address**

1. Go to "Network Access"
2. Click "Add IP Address"
3. Choose "Allow Access from Anywhere" (for development)
   - Or add your current IP specifically
4. Click "Confirm"

**Discuss:** Is "Allow Access from Anywhere" safe?

<details>
<summary>Solution (Step 6D)</summary>

**For development:** "Allow Access from Anywhere" (0.0.0.0/0) is convenient but less secure.

**For production:** Whitelist only:
- Your server's IP address
- Your company's IP range
- VPN endpoints

Even with "anywhere" access, attackers still need:
- Your connection string
- Valid username/password

But restricting IPs adds an extra layer of security.

</details>

**Step 6E — Get Connection String**

1. Go to "Database" (main cluster view)
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Driver: Node.js
5. Copy the connection string

It looks like:

```
mongodb+srv://<username>:<password>@cluster.abc123.mongodb.net/?retryWrites=true&w=majority
```

**Discuss:** What does `+srv` mean in the URI?

<details>
<summary>Solution (Step 6E)</summary>

`mongodb+srv://` uses DNS SRV records to:
- Automatically discover all cluster nodes
- Handle failover if one node goes down
- Simplify connection string (no need to list all servers)

Regular `mongodb://` requires manual server list.

</details>

**Step 6F — Update `.env` with Atlas URI**

- Stop your server
- Open `.env`
- Replace `MONGO_URI` with your Atlas connection string:

```env
MONGO_URI=mongodb+srv://webdev:<password>@cluster.abc123.mongodb.net/web-dev?retryWrites=true&w=majority
```

**Important:**
- Replace `<password>` with actual password
- Add database name before `?` (e.g., `/web-dev`)

**Commit:** `chore: migrate database from local MongoDB to Atlas`

<details>
<summary>Solution (Step 6F)</summary>

Complete `.env` example:

```env
PORT=4000
MONGO_URI=mongodb+srv://webdev:MySecureP@ssw0rd@cluster0.abc123.mongodb.net/web-dev?retryWrites=true&w=majority
GOOGLE_AI_API_KEY=AIzaSyC...your-key...
```

Common mistakes:
- Forgot to replace `<password>` with actual password
- Password contains special characters that need URL encoding
- Missing database name in URI
- Extra spaces in URI

</details>

**Step 6G — Restart Server and Test**

- Start server: `npm run dev`
- Look for: `"MongoDB connected successfully"`

**Postman tests:**

1. `GET http://localhost:4000/tours` → should work (empty array)
2. `POST http://localhost:4000/tours` → create a tour
3. `GET http://localhost:4000/tours` → see the tour

**If connection fails**, check:
- Password is correct and URL-encoded
- IP address is whitelisted
- Cluster is active
- Internet connection works

**Discuss:** How can you tell if you're connected to Atlas vs local?

<details>
<summary>Solution (Step 6G)</summary>

You can verify Atlas connection by:

1. **Console message** — Still says "MongoDB connected successfully"
2. **Atlas UI** — Go to "Collections" tab, you should see your database and data
3. **URI in .env** — Contains `mongodb+srv://` (not `localhost`)

To test both work:
- Switch `.env` back to localhost, restart → works
- Switch to Atlas, restart → works

Your code is identical; only the connection string changes.

</details>

**Step 6H — View Data in Atlas UI**

1. In Atlas, go to "Browse Collections"
2. Find your database (e.g., `web-dev`)
3. See collections (`tours`, `users`)
4. Click to view documents

**Discuss:** What's a "collection" in MongoDB?

<details>
<summary>Solution (Step 6H)</summary>

MongoDB terminology:
- **Database** — Like a SQL database (e.g., `web-dev`)
- **Collection** — Like a SQL table (e.g., `tours`, `users`)
- **Document** — Like a SQL row (one tour, one user)
- **Field** — Like a SQL column (e.g., `name`, `price`)

Collections:
- Don't require predefined schemas (schema-less)
- Can have documents with different fields
- Automatically created when you insert first document

</details>

---

## Part 2: AI Integration (Optional)

> **Target Audience**: This task is **primarily intended for group members responsible for implementing AI features in their group project**. It is optional for all other students.

In this part, you will work with AI-powered endpoints to enhance your application's functionality.

1. **Understand the Existing AI Setup**
   - Review the AI code explanation in [**`AI_API_Setup_and_Logic.md`**](https://github.com/tx00-resources-en/AI-part2-demo/blob/main/AI_API_Setup_and_Logic.md)
   - Ensure the current AI API is running correctly by following the setup instructions

2. **Complete the AI Task**
   - Follow the step-by-step instructions in [**`task.md`**](https://github.com/tx00-resources-en/AI-part2-demo/blob/main/task.md)
   - Each step includes a sample solution wrapped in a `<details>` tag for reference
   - Reuse the same logic and structure to build your new AI endpoint

3. **Commit Your Work**
   - Use appropriate commit messages following the format established in Part 1:
     - *feat* when you add a new feature or new functionality to the codebase.
     - *refactor* when you change existing code without altering behavior. 
     - *chore* used for maintenance tasks that don’t change application behavior.


<!-- 
```sh
npm i express mongoose morgan @google/genai dotenv
npm i jest nodemon supertest -D
``` 
-->
