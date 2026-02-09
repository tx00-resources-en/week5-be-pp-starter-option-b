require('dotenv').config();
const express = require("express");
const app = express();
const tourRouter = require("./routes/tourRouter");
const userRouter = require("./routes/userRouter");
const aiRoutes = require("./routes/aiRoutes");
const { unknownEndpoint } = require("./middleware/customMiddleware");

const morgan = require("morgan");
app.use(morgan("dev"));

// Middleware to parse JSON
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running');
});

// Use text routes
app.use('/api/ai', aiRoutes);
 
// Use the tourRouter for all "/tours" routes
app.use("/api/tours", tourRouter);

// Use the userRouter for all /users routes
app.use("/api/users", userRouter);

app.use(unknownEndpoint);
// app.use(errorHandler);

const port = process.env.PORT || 4000;
// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
 