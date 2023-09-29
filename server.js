const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));


// Routes
// Displays the home page.
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
  //Displays the notes page.
  app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'));
  });
  
  // Binds the connections and listens to them in the specified PORT.
  app.listen(PORT, () => {
    console.log(`App listening on PORT: ${PORT}`);
  });

//Reads the db.json file using fs and parses it into a js object.
const readNotes = () => {
  return new Promise((resolve, reject) => {
    console.log("About to read the db.json file");

    fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8', (err, data) => {
      if (err) {
        console.log('Error reading file:', err);
        reject(err);
      } else {
        console.log('Successfully read file:', data);
        resolve(JSON.parse(data));
      }
    });
  });
};

//Writes a new note and converts into a JSON string.
const writeNotes = (notes) => {
  return new Promise((resolve, reject) => {
    console.log("About to write to the db.json file", notes);

    fs.writeFile(path.join(__dirname, 'db', 'db.json'), JSON.stringify(notes), 'utf8', (err) => {
      if (err) {
        console.log('Error writing file:', err);
        reject(err);
      } else {
        console.log('Successfully wrote file.');
        resolve();
      }
    });
  });
};

//APIs
// GET Endpoint to Retrieve All Notes
app.get('/api/notes', (req, res) => {
  readNotes()
    .then((notes) => {
      res.json(notes.notes);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

// POST Endpoint to Add a New Note
app.post('/api/notes', (req, res) => {
  const newNote = req.body;

  readNotes()
    .then((notes) => {
      newNote.id = notes.notes.length + 1;
      notes.notes.push(newNote);
      return writeNotes(notes);
    })
    .then(() => {
      res.json(newNote);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

// DELETE Endpoint to Remove a Note
app.delete('/api/notes/:id', (req, res) => {
  const id = parseInt(req.params.id);

  readNotes()
    .then((notes) => {
      const newNotesArray = notes.notes.filter((note) => note.id !== id);
      notes.notes = newNotesArray;
      return writeNotes(notes);
    })
    .then(() => {
      res.json({ id: id });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});
