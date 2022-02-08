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
    async updatenotes(req, res) {
      const { title, description, tag } = req.body;
      const newNote = {};
      if (title) newNote.title = title;
      if (description) newNote.description = description;
      if (tag) newNote.tag = tag;
      try {
        let note = await Notes.findById(req.params.id);
        if (!note) return res.status(404).send("Not found");

        if (note.user.toString() !== req.user.id)
          return res.status(401).send("Access Denied");

        note = await Notes.findByIdAndUpdate(
          req.params.id,
          { $set: newNote },
          { new: true }
        );
        if (note)
          res.status(200).send({
            message: "Note update successfully",
            note,
          });
      } catch (error) {
        console.log(error);
        return res.status(500).send("Internal server error");
      }
    },
    async deletenotes(req, res) {
      try {
        const note = await Notes.findById(req.params.id);
        if (!note) return res.status(404).send("Not found");
        if (note.user.toString() !== req.user.id)
          return res.status(401).send("Access Denied");
        const deleteNote = await Notes.findByIdAndDelete(req.params.id);
        if (deleteNote)
          res.status(200).send({ message: "Note deleted successfully" });
      } catch (error) {
        return res.status(500).send({ error: "Internal server error" });
      }
    },
  };
}

module.exports = NotesController;
