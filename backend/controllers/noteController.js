// controllers/noteController.js
import mongoose from "mongoose";
import {
  findAllNotes,
  findNoteById,
  createNote,
  updateNote,
  deleteNote,
} from "../services/noteService.js";

// GET /api/notes
export const getNotesController = async (req, res) => {
  try {
    const notes = await findAllNotes();
    res.status(200).json(notes);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching notes", error: error.message });
  }
};

// POST /api/notes
export const createNoteController = async (req, res) => {
  try {
    const note = await createNote(req.body);
    res.status(201).json(note);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating note", error: error.message });
  }
};

// PUT /api/notes/:id
export const updateNoteController = async (req, res) => {
  const { id } = req.params;

  // Validate ID format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid note ID format" });
  }

  try {
    const updatedNote = await updateNote(id, req.body);
    if (!updatedNote) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.status(200).json(updatedNote);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating note", error: error.message });
  }
};

// DELETE /api/notes/:id
export const deleteNoteController = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid note ID format" });
  }

  try {
    const deletedNote = await deleteNote(id);
    if (!deletedNote) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.status(204).send(); // 204 No Content on successful deletion
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting note", error: error.message });
  }
};
