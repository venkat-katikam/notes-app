const Note = require("../models/noteModel");
const asyncHandler = require("express-async-handler");

// @desc    Get logged in user notes
// @route   GET /api/notes
// @access  Private
const getNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find({ user: req.user._id });
  res.json(notes);
});

//@description     Create single Note
//@route           GET /api/notes/create
//@access          Private
const createNote = asyncHandler(async (req, res) => {
  const { title, content, category } = req.body;

  if (!title || !content || !category) {
    res.status(400);
    throw new Error("Please fill all the Fields");
  } else {
    const note = new Note({ user: req.user._id, title, category, content });

    const createdNote = await note.save();

    res.status(201).json(createdNote);
  }
});

//@description     Fetch single Note
//@route           GET /api/notes/:id
//@access          Public
const getNoteById = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (note) {
    res.json(note);
  } else {
    res.status(404).json({ message: "Note not found" });
  }
});

// @desc    Update a note
// @route   PUT /api/notes/:id
// @access  Private
const updateNote = asyncHandler(async (req, res) => {
  const { title, content, category } = req.body;

  const note = await Note.findById(req.params.id);

  // checking if the id in the note object is same as id which came from req params
  if (note.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("You cant perform this action");
  }
  if (note) {
    note.title = title;
    note.content = content;
    note.category = category;

    // here you can just perform save but to return updated note to user, its is assigned to updatedNote variable

    const updatedNote = await note.save();
    res.json(updatedNote);
  } else {
    res.status(404);
    throw new Error("Note not found");
  }
});

//@description     Delete single Note
//@route           GET /api/notes/:id
//@access          Private
const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  // checking if the id in the note object is same as id which came from req params
  if (note.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("You cant perform this action");
  }

  if (note) {
    await note.deleteOne();
    res.json({ message: "Note deleted" });
  } else {
    res.status(404);
    throw new Error("Note not found");
  }
});

module.exports = { getNotes, createNote, getNoteById, updateNote, deleteNote };
