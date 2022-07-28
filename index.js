const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const Note = require('./models/note');

const requestLogger = (req, res, next) => {
    console.log('Method: ', req.method)
    console.log('Path: ', req.path)
    console.log('Body: ', req.body)
    console.log('---')
    next()
}

app.use(express.json())

app.use(requestLogger)

app.use(cors())

app.get('/', (req, res) => {
    res.send('<h1>Elo z homepage</h1>')
})

app.get('/api/notes', (req, res) => {
    Note.find({}).then(notes => {
        res.json(notes)
    })
})

app.get('/api/notes/:id', (req, res) => {
    Note.findById(req.params.id).then(note => {
        res.json(note)
    })
})

app.delete('/api/notes/:id', (req, res) => {
    const id = Number(req.params.id)
    notes = notes.filter(note => note.id !== id)

    res.status(204).end()
})

app.post('/api/notes', (req, res) => {
    const body = req.body;

    if(body.content === undefined) {
        return res.status(400).json({ error: 'content missing' })
    }

    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date(),
    })

    note.save().then( savedNote => {
        res.json(savedNote)
    })
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({error: 'unkown endpoint'})
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});
