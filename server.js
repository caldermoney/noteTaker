const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
  
  app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'));
  });
  
  // Starting the server
  app.listen(PORT, () => {
    console.log(`App listening on PORT: ${PORT}`);
  });

  // Read db.json file and return all saved notes as JSON
app.get('/notes', (req, res) => {
    fs.readFile(path.join(__dirname, 'db.json'), 'utf8', (err, data) => {
      if (err) {
        return console.log(err);
      }
      return res.json(JSON.parse(data));
    });
  });

 // API POST request to save a new note
app.post('/notes', (req, res) => {
    fs.readFile(path.join(__dirname, 'db/db.json'), 'utf8', (err, data) => {
      if (err) {
        return console.log(err);
      }
      const notes = JSON.parse(data);
      const newNote = req.body;
      console.log(req.body);
      console.log(newNote);
      newNote.id = notes.length ? notes[notes.length - 1].id + 1 : 1;
      console.log(notes);
      notes.push(newNote);
      console.log(notes);

  
      fs.writeFile(path.join(__dirname, 'db/db.json'), JSON.stringify(notes), (err) => {
        if (err) {
          return console.log(err);
        }
        res.json(newNote);
      });
    });
  });
  
  app.delete('/notes/:id', (req, res) => {
    const noteId = parseInt(req.params.id);
    fs.readFile(path.join(__dirname, 'db.json'), 'utf8', (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'An error occurred while reading db.json.' });
      }
      const notes = JSON.parse(data);
      const updatedNotes = notes.filter(note => note.id !== noteId);
      fs.writeFile(path.join(__dirname, 'db.json'), JSON.stringify(updatedNotes), (err) => {
        if (err) {
          return res.status(500).json({ error: 'An error occurred while writing to db.json.' });
        }
        res.status(200).json({ message: `Note with id ${noteId} has been deleted.` });
      });
    });
  });
  
  
  