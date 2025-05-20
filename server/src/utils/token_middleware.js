const jwt = require("jsonwebtoken");
const {
  createAccessToken,
  createRefreshToken,
} = require("../utils/token.service");

const tokenMiddleware = (req, res, next) => {
  // getting tokens
  const accessToken = req.headers.authorization?.split(" ")[1];
  const refreshToken = req.cookies.refreshToken;

  // verify tokens
  if (!accessToken) {
    // verify refresh token
    if (!refreshToken) {
      console.log("No refresh token");
      return res.status(401).json({ ok: false, message: "Unauthorized" });
    } else {
      // if refresh token is not null or undefined or empty
      try {
        const decoded = jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET
        );

        // creating new tokens
        const newAccessToken = createAccessToken(decoded.userID);
        const newRefreshToken = createRefreshToken(decoded.userID);

        // setting new refresh token in cookie
        res.cookie("refreshToken", newRefreshToken, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          maxAge: 1000 * 60 * 60 * 24 * 7,
        });
        // setting new access token in header
        res.setHeader("access-token", `Bearer ${newAccessToken}`);

        // saving userID from decoded token in request
        req.userID = decoded.userID;
        // moving to next middleware
        return next();
      } catch (error) {
        // if refresh token is invalid
        console.log("Invalid refresh token");
        return res.status(401).json({ ok: false, message: "Unauthorized" });
      }
    }
    console.log("No access token");
  }

  // if access token is not null or undefined or empty
  try {
    // verify access token
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

    // saving userID from decoded token in request
    req.userID = decoded.userID;
    // moving to next middleware
    return next();
  } catch (error) {
    // if access token is invalid
    // verify refresh token
    if (!refreshToken) {
      console.log("No refresh-access token");
      return res.status(401).json({ ok: false, message: "Unauthorized" });
    }

    // if refresh token is not null or undefined or empty
    try {
      // verify refresh token
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );

      // creating new tokens
      const newAccessToken = createAccessToken(decoded.userID);
      const newRefreshToken = createRefreshToken(decoded.userID);

      // setting new refresh token in cookie
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });
      // setting new access token in header
      res.setHeader("access-token", `Bearer ${newAccessToken}`);

      // saving userID from decoded token in request
      req.userID = decoded.userID;
      // moving to next middleware
      return next();
    } catch (error) {
      // if refresh token is invalid
      console.log("Invalid refresh-access token");
      return res.status(401).json({ ok: false, message: "Unauthorized" });
    }
  }
};

module.exports = tokenMiddleware;
