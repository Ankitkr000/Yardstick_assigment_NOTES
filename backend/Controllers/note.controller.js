
const Note = require("../Models/note.model");


const createNote = async (req, res) => {
  try {
    const { noteTitle, noteContent } = req.body;
    
   
    const note = await Note.create({
      noteTitle,
      noteContent,
      createdBy: req.user.id,
      tenant: req.user.tenantId
    });

    res.status(201).json({
      success: true,
      data: note
    });
  } catch (error) {
    console.error("Create Note Error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating note"
    });
  }
};


const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ tenant: req.user.tenantId }).populate("createdBy", "name email");
    return res.status(200).json({ success: true, data: notes });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};


const getNoteById = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, tenant: req.user.tenantId });
    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }
    return res.status(200).json({ success: true, data: note });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};


const updateNote = async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, tenant: req.user.tenantId },
      { noteTitle: req.body.noteTitle, noteContent: req.body.noteContent },
      { new: true }
    );
        
    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }

    return res.status(200).json({ success: true, message: "Note updated", data: note });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};


const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, tenant: req.user.tenantId });
    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }
    return res.status(200).json({ success: true, message: "Note deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

module.exports = { createNote, getNotes, getNoteById, updateNote, deleteNote };
