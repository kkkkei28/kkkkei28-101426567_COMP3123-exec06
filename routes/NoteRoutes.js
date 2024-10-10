const express = require("express");
const noteModel = require('../models/NotesModel.js'); 
const routes = express.Router(); 

routes.use(express.json()); // Middleware to parse JSON requests

// Create a new Note
routes.post('/notes', async (req, res) => {
    // Validate request
    if (!req.body.noteTitle || !req.body.noteDescription || !req.body.priority) {
        return res.status(400).send({
            message: "Note title, description, and priority are required"
        });
    }
    try {
        const note = new noteModel({
            noteTitle: req.body.noteTitle,
            noteDescription: req.body.noteDescription,
            priority: req.body.priority,
            dateAdded: new Date(),
            dateUpdated: new Date()
        });
        const savedNote = await note.save();
        res.status(201).send(savedNote);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the note."
        });
    }
});


// Retrieve all Notes
routes.get('/notes', async (req, res) => {
    try {
        const notes = await noteModel.find();
        res.send(notes);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving the notes."
        });
    }
});

// Retrieve a single Note with noteId
routes.get('/notes/:noteId', async (req, res) => {
    try {
        const note = await noteModel.findById(req.params.noteId);
        if (!note) {
            return res.status(404).send({
                message: `Note not found with id ${req.params.noteId}`
            });
        }
        res.send(note);
    } catch (err) {
        res.status(500).send({
            message: `Error retrieving note with id ${req.params.noteId}`
        });
    }
});

// Update a Note with noteId
routes.put('/notes/:noteId', async (req, res) => {
    if (!req.body.noteTitle || !req.body.noteDescription || !req.body.priority) {
        return res.status(400).send({
            message: "Note title, description, and priority are required"
        });
    }
    try {
        const note = await noteModel.findByIdAndUpdate(
            req.params.noteId,
            {
                noteTitle: req.body.noteTitle,
                noteDescription: req.body.noteDescription,
                priority: req.body.priority,
                dateUpdated: new Date()
            },
            { new: true }
        );
        if (!note) {
            return res.status(404).send({
                message: `Note not found with id ${req.params.noteId}`
            });
        }
        res.send(note);
    } catch (err) {
        res.status(500).send({
            message: `Error updating note with id ${req.params.noteId}`
        });
    }
});

// Delete a Note with noteId
routes.delete('/notes/:noteId', async (req, res) => {
    try {
        const note = await noteModel.findByIdAndDelete(req.params.noteId);
        if (!note) {
            return res.status(404).send({
                message: `Note not found with id ${req.params.noteId}`
            });
        }
        res.send({ message: "Note deleted successfully!" });
    } catch (err) {
        res.status(500).send({
            message: `Could not delete note with id ${req.params.noteId}`
        });
    }
});

module.exports = routes;
