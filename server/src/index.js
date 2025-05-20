require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const router = require("./routes/router");

// creating express app
const app = express();

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: `${process.env.CLIENT_URL}`,
    credentials: true,
  })
);

// routes
app.use(router);

// server listening
app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
