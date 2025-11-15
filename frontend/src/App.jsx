// src/App.jsx
import { useState, useEffect, useCallback, useRef } from "react";
import "./App.css"; // Import the new CSS file
import {
  getAllNotes,
  createNote,
  updateNote,
  deleteNote,
  NOTE_COLORS,
} from "./apiService";

const tempId = () => Math.random().toString(36).substring(2, 9); // Temp ID utility

// --- Component 1: NoteModal ---
const NoteModal = ({ isOpen, onClose, onSave, noteToEdit }) => {
  const isEditing = !!noteToEdit;
  const [content, setContent] = useState(isEditing ? noteToEdit.content : "");
  const [color, setColor] = useState(isEditing ? noteToEdit.color : "default");

  useEffect(() => {
    setContent(isEditing ? noteToEdit.content : "");
    setColor(isEditing ? noteToEdit.color : "default");
  }, [isOpen, isEditing, noteToEdit]);

  const handleSave = () => {
    if (content.trim() === "") return;
    onSave({
      id: isEditing ? noteToEdit.id : tempId(),
      content: content,
      color: color,
    });
    setContent("");
    setColor("default");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="text-xl font-bold mb-4">
          {isEditing ? "Edit Note" : "Add New Note"}
        </h2>

        {/* Color Selection */}
        <div className="mb-4 flex space-x-3 items-center">
          <label className="font-medium text-gray-700">Select Color:</label>
          {["default", ...NOTE_COLORS].map((c) => (
            <div
              key={c}
              onClick={() => setColor(c)}
              className={`color-picker-box ${
                c === "default"
                  ? "border-gray-400"
                  : `bg-${c}-300 border-${c}-500`
              } ${color === c ? "ring-selected" : ""}`}
              style={{
                backgroundColor: c === "default" ? "white" : undefined,
                borderColor: c === "default" ? "#9ca3af" : undefined,
              }}
              title={c.charAt(0).toUpperCase() + c.slice(1)}
            />
          ))}
        </div>

        {/* Text Area Input */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type your note content here..."
          rows="5"
          className="w-full p-3 border border-gray-300 rounded-md"
        />

        {/* Buttons */}
        <div className="mt-4 flex justify-end space-x-3">
          <button onClick={onClose} className="btn btn-cancel">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={content.trim() === ""}
            className="btn btn-green"
          >
            {isEditing ? "Save Changes" : "Add Note"}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Component 2: NoteCard with Drag handlers ---
const NoteCard = ({ note, onEdit, onDelete }) => {
  const cardClasses = `note-card color-${note.color}`;
  return (
    <div
      className={cardClasses}
      // Must be present to allow drop
      data-id={note._id}
    >
      <p className="note-card-content">{note.content}</p>

      <div className="note-card-actions">
        <button onClick={() => onEdit(note)} className="btn btn-blue">
          Edit
        </button>
        <button onClick={() => onDelete(note._id)} className="btn btn-red">
          Delete
        </button>
      </div>
    </div>
  );
};

// --- Component 3: Main Application Component ---
export default function App() {
  const [notes, setNotes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState(null);

  // Refs for Drag and Drop tracking
  const dragItem = useRef(null); // ID of the note being dragged
  const dragOverItem = useRef(null); // ID of the note the dragged item is over

  // --- API Handlers ---

  const loadNotes = useCallback(async () => {
    try {
      const fetchedNotes = await getAllNotes();
      setNotes(fetchedNotes);
    } catch (e) {
      console.error("Failed to load notes:", e);
    }
  }, []);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const handleAddEditNote = async (newNoteData) => {
    try {
      if (noteToEdit) {
        await updateNote(noteToEdit._id, {
          content: newNoteData.content,
          color: newNoteData.color,
        });
      } else {
        // Find the next available order number
        const newOrder =
          notes.length > 0 ? notes[notes.length - 1].order + 1 : 1;
        await createNote({
          content: newNoteData.content,
          color: newNoteData.color,
          order: newOrder,
        });
      }
      loadNotes();
    } catch (e) {
      console.error("Failed to save note:", e);
    }
    setNoteToEdit(null);
    setIsModalOpen(false);
  };

  const handleDeleteNote = async (id) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        await deleteNote(id);
        loadNotes();
      } catch (e) {
        console.error("Failed to delete note:", e);
      }
    }
  };

  // --- Drag and Drop Handlers ---

  // --- Render ---

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="text-4xl font-extrabold text-gray-800">
          Simple Note App 📌
        </h1>
        <button
          onClick={() => {
            setNoteToEdit(null);
            setIsModalOpen(true);
          }}
          className="btn btn-primary"
        >
          ➕ Add Note
        </button>
      </header>

      {/* Grid of Notes */}
      <div className="notes-grid">
        {notes.map((note) => (
          <NoteCard
            key={note._id}
            note={note}
            onEdit={(n) => {
              setNoteToEdit(n);
              setIsModalOpen(true);
            }}
            onDelete={handleDeleteNote}
          />
        ))}
        {notes.length === 0 && (
          <p className="text-gray-500 text-center py-10">
            No notes found. Click "Add Note" to get started!
          </p>
        )}
      </div>

      {/* Add/Edit Modal */}
      <NoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddEditNote}
        noteToEdit={noteToEdit}
      />
    </div>
  );
}
