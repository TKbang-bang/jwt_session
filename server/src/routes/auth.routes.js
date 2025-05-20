const { Router } = require("express");
const {
  nameValidator,
  emailValidator,
  passwordValidator,
} = require("../utils/validations");
const pool = require("../db/pool");
const bcrypt = require("bcrypt");
const {
  createAccessToken,
  createRefreshToken,
} = require("../utils/token.service");

// creating router
const authRoutes = Router();

// register route
authRoutes.post("/register", async (req, res) => {
  try {
    // credentials from client
    const { name, email, password } = req.body;

    // credentials validations
    const nameValidation = nameValidator(name);
    if (!nameValidation.ok)
      return res.status(nameValidation.status).json(nameValidation.message);
    const emailValidation = emailValidator(email);
    if (!emailValidation.ok)
      return res.status(emailValidation.status).json(emailValidation.message);
    const passwordValidation = passwordValidator(password);
    if (!passwordValidation.ok)
      return res
        .status(passwordValidation.status)
        .json(passwordValidation.message);

    // verify if user already exists
    const [user] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (user.length > 0)
      return res
        .status(409)
        .json({ ok: false, message: "User already exists" });

    // creating user
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = crypto.randomUUID();
    await pool.query(
      "INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)",
      [userId, name, email, hashedPassword]
    );

    // sending response
    return res
      .status(201)
      .json({ ok: true, message: "User created successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: "Internal server error" });
  }
});

authRoutes.post("/login", async (req, res) => {
  try {
    // credentials from client
    const { email, password } = req.body;

    // credentials validations
    const emailValidation = emailValidator(email);
    if (!emailValidation.ok)
      return res.status(emailValidation.status).json(emailValidation.message);
    const passwordValidation = passwordValidator(password);
    if (!passwordValidation.ok)
      return res
        .status(passwordValidation.status)
        .json(passwordValidation.message);

    // verify if user exists
    const [user] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (user.length === 0)
      return res.status(404).json({ ok: false, message: "User not found" });

    // verify password
    const passwordMatch = await bcrypt.compare(password, user[0].password);
    if (!passwordMatch)
      return res.status(400).json({ ok: false, message: "Invalid password" });

    // jwt session
    const accessToken = createAccessToken(user[0].id);
    const refreshToken = createRefreshToken(user[0].id);

    // sending cookies/tokens to client
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    res.status(200).json({ ok: true, accessToken });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: "Internal server error" });
  }
});

module.exports = authRoutes;
