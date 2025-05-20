const { Router } = require("express");
const authRoutes = require("./auth.routes");
const protectedRoutes = require("./protected.routes");
const tokenMiddleware = require("../utils/token_middleware");

// creating router
const router = Router();

// routes
router.use("/auth", authRoutes);
// protected routes
router.use("/protected", tokenMiddleware, protectedRoutes);

module.exports = router;
