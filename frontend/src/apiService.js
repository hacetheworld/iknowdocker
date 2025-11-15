// src/apiService.js
import axios from "axios";

// Replace with your actual backend URL
const API_URL = `http://localhost:5000/api/notes`;

export const NOTE_COLORS = ["red", "blue", "yellow"];

/** * GET: Fetches all notes, typically ordered by the 'order' field.
 */
export const getAllNotes = async () => {
  try {
    const response = await axios.get(API_URL);
    // Crucial for D&D: Ensure notes are sorted by 'order' from the backend
    return response.data.sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error("Error fetching notes:", error);
    throw error;
  }
};

/** * POST: Creates a new note.
 */
export const createNote = async (noteData) => {
  try {
    const response = await axios.post(API_URL, noteData);
    return response.data;
  } catch (error) {
    console.error("Error creating note:", error);
    throw error;
  }
};

/** * PUT/PATCH: Updates an existing note (content, color, or order).
 */
export const updateNote = async (id, noteData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, noteData);
    return response.data;
  } catch (error) {
    console.error(`Error updating note with ID ${id}:`, error);
    throw error;
  }
};

/** * DELETE: Deletes a note by ID.
 */
export const deleteNote = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
    return true;
  } catch (error) {
    console.error(`Error deleting note with ID ${id}:`, error);
    throw error;
  }
};
