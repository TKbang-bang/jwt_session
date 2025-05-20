const { Router } = require("express");
const pool = require("../db/pool");

const protectedRoutes = Router();

// protected route /
protectedRoutes.get("/", async (req, res) => {
  // verify if user is authenticated
  if (!req.userID)
    return res.status(401).json({ ok: false, message: "Unauthorized" });

  try {
    // getting user from database on id from request
    const [user] = await pool.query(
      "SELECT id, name, email FROM users WHERE id = ?",
      [req.userID]
    );

    // return user
    return res.status(200).json({ ok: true, user: user[0] });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: "Internal server error" });
  }
});

module.exports = protectedRoutes;
