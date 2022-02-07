// const Notes = require("../models/notes");

const mongoose = require("mongoose");
const { Schema } = mongoose;
const { validationResult } = require("express-validator");
const NotesSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userRegisteration",
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    tag: {
      type: String,
      default: "General",
    },
  },
  {
    timestamps: true,
  }
);
const Notes = mongoose.model("note", NotesSchema);

function NotesController() {
  return {
    async getAllnotes(req, res) {
      try {
        const notes = await Notes.find({ user: req.user.id });
        res.status(200).json(notes);
      } catch (error) {
        return res.status(500).send({ error: "Internal server error" });
      }
    },
    async addnote(req, res) {
      const { title, description, tag } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      try {
        const notes = new Notes({ title, description, tag, user: req.user.id });
        const saveNotes = await notes.save();
        if (saveNotes) {
          res
            .status(200)
            .send({ message: "Notes saved successfully", note: saveNotes });
        }
      } catch (error) {
        return res.status(500).send({ error: "Internal server error" });
      }
    },
  };
}

module.exports = NotesController;
