// routes/note.routes.js
const express = require("express");
const { auth, checkSubscription } = require("../Middleware/auth.middleware");
const { createNote, getNotes, getNoteById, updateNote, deleteNote } = require("../Controllers/note.controller");

const noteRouter = express.Router();

noteRouter.post("/", auth, checkSubscription, createNote);
noteRouter.get("/", auth, getNotes);
noteRouter.get("/:id", auth, getNoteById);
noteRouter.put("/:id", auth, updateNote);
noteRouter.delete("/:id", auth, deleteNote);

module.exports = { noteRouter };
