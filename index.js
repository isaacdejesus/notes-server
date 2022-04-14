require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const Note = require('./models/note.js')

//middleware called in order declared
//defines a middleware function
const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:', request.path)
    console.log('Body:', request.body)
    console.log('---')
    next()
}
//calls to middleware
app.use(cors())
app.use(express.json())
app.use(requestLogger)
app.use(express.static('build'))

//sends back json object containing all notes
app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes)
    })
})
//sends back a note matching given :id
app.get('/api/notes/:id', (request, response) => {
    Note.findById(request.params.id)
        .then(note => {
            if(note)
                response.json(note)
            else
                response.status(404).end()
    })
        .catch(error => next(error))
})
//deletes a note based on :id
app.delete('/api/notes/:id', (request, response) => {
    Note.findByIdAndRemove(request.params.id)
        .then(result => {
        response.status(204).end()
    })
        .catch(error => next(error))
})
//Adds a new note to the notes array
app.post('/api/notes', (request, response) => {
    const body = request.body 
    if(body.content === undefined) {
        return response.status(400).json({
            error: 'content missing'
        })}
        const note = new Note({
            content: body.content,
            important: body.important || false,
            date: new Date(),
        })
        note.save().then(savedNote => {
            response.json(savedNote)
        })
    
})
//modify content of  post
app.put('/api/notes/:id', (request, response, next) => {
    const body = request.body
    const note = {
        content: body.content,
        important: body.important,
    }
    Note.findByIdAndUpdate(request.params.id, note, {new: true})
        .then(updatedNote => {
            response.json(updatedNote)
        })
        .catch(error => next(error))
})
//last middleware in chain. Handles failed requests
const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'})
}
app.use(unknownEndpoint)
const errorHandler = (error, request, response, next) => {
    console.log(error.message)
    if(error.name === 'CastError'){
        return response.status(400).send({error: 'malformatted id'})
    }
    next(error)
}
app.use(errorHandler)
const PORT = process.env.PORT 
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
