// models/Note.js
import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true,
  },
  color: {
    type: String,
    enum: ["default", "red", "blue", "yellow"],
    default: "default",
  },
  order: {
    type: Number,
    required: true,
    unique: true, // Ensure uniqueness for ordering simplicity
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Note", NoteSchema);
