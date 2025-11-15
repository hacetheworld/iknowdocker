// routes/noteRoutes.js
import express from "express";
import {
  getNotesController,
  createNoteController,
  updateNoteController,
  deleteNoteController,
} from "../controllers/noteController.js";

const router = express.Router();

// GET all notes and POST a new note
router.route("/").get(getNotesController).post(createNoteController);

// PUT/PATCH (Update) and DELETE a specific note by ID
router.route("/:id").put(updateNoteController).delete(deleteNoteController);

export default router;
