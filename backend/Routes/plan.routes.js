const express = require("express");
const { auth, isAdmin } = require("../Middleware/auth.middleware");
const { upgradeTenant } = require("../Controllers/plan.controller");

const planRouter = express.Router();

planRouter.post("/tenants/:slug/upgrade", auth, isAdmin, upgradeTenant);

module.exports = { planRouter };
