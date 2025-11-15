// services/noteService.js
import Note from "../models/Note.js";

// --- CRUD Operations ---

// GET All Notes
export const findAllNotes = async () => {
  // Return notes sorted by the 'order' field
  return await Note.find().sort({ order: 1 });
};

// GET Single Note by ID
export const findNoteById = async (id) => {
  return await Note.findById(id);
};

// CREATE Note
export const createNote = async (noteData) => {
  // Note: The frontend sends { content, color, order }.
  // The 'order' is crucial and should be calculated by the frontend (or here)
  // to ensure it's higher than all existing notes.
  const newNote = new Note(noteData);
  return await newNote.save();
};

// UPDATE Note (for content, color, or order)
export const updateNote = async (id, updateData) => {
  // { new: true } returns the updated document
  const updatedNote = await Note.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
  return updatedNote;
};

// DELETE Note
export const deleteNote = async (id) => {
  return await Note.findByIdAndDelete(id);
};

// --- Ordering Utility ---

/**
 * Updates the 'order' field for multiple notes.
 * Used for the Drag and Drop functionality.
 * @param {Array<Object>} notes - Array of objects, each containing { id, order }
 */
export const bulkUpdateOrders = async (notes) => {
  const bulkOperations = notes.map((note) => ({
    updateOne: {
      filter: { _id: note.id },
      update: { $set: { order: note.order } },
    },
  }));

  if (bulkOperations.length === 0) return { message: "No updates to perform" };

  // Use bulkWrite for efficient multiple updates
  return await Note.bulkWrite(bulkOperations);
};
