const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  noteTitle: { type: String, required: true },
  noteContent: { type: String, required: true },


  tenant: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant", required: true },
  

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model("Note", noteSchema);
