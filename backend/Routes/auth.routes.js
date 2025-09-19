const express = require("express");
const { signUp, login, logout } = require("../Controllers/auth.controller");

const authRouter = express.Router();

authRouter.post("/signup", signUp);
authRouter.post("/login", login);
authRouter.post("/logout", logout);

module.exports = { authRouter };
