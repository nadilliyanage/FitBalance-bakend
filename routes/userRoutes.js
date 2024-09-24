const express = require("express");
const {
  registerController,
  loginController,
  logoutController,
} = require("../controllers/userController");
const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/logout", logoutController); // Add logout route

module.exports = router;
