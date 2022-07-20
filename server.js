const fs = require('fs');
const path = require('path');
const express = require('express');
const { notes } = require('./data/notes');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

function findById(id, notesArray) {
  const result = notesArray.filter(note => note.id === id)[0];
  return result;
}

function createNewNote(body, notesArray) {
  const note = body;
  notesArray.push(note);
  fs.writeFileSync(
    path.join(__dirname, './data/notes.json'),
    JSON.stringify({ notes: notesArray }, null, 2)
  );
  return note;
}

function validateNote(note) {
  if (!note.title || typeof note.title !== 'string') {
    return false;
  }
  if (!note.detail || typeof note.detail !== 'string') {
    return false;
  }
  return true;
}

app.get('/api/notes', (req, res) => {
  let results = notes;

  res.json(results);
});

app.delete('/api/notes/:id', (req, res) => {
const result=removeById (req.params.id);
console.log(result);
  if (result) {
    fs.writeFileSync(
      path.join(__dirname, './data/notes.json'),
      JSON.stringify({ notes: notes }, null, 2)
    );
    res.json(notes);
  } else {
    res.send(404);
  }
});

const removeById = (id) => {
  const requiredIndex = notes.findIndex(el => {
     return el.id === String(id);
  });
  if(requiredIndex === -1){
     return false;
  };
  return !!notes.splice(requiredIndex, 1);
};

app.post('/api/notes', (req, res) => {
  // set id based on what the next index of the array will be
  req.body.id = notes.length.toString();

  if (!validateNote(req.body)) {
    res.status(400).send(req.body);
  } else {
    const note = createNewNote(req.body, notes);
    res.json(note);
  }
});

app.post('/api/oldnotes', (req, res) => {
  // set id based on what the next index of the array will be
  removeById(req.body.id);
  if (!validateNote(req.body)) {
    res.status(400).send(req.body);
  } else {
    const note = createNewNote(req.body, notes);
    res.json(note);
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});

