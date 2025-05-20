const jwt = require("jsonwebtoken");

// creating access token
const createAccessToken = (id) => {
  return jwt.sign({ userID: id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};

// creating refresh token
const createRefreshToken = (id) => {
  return jwt.sign({ userID: id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

module.exports = { createAccessToken, createRefreshToken };
