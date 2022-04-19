const notesRouter = require('express').Router()
const Note = require('../models/note.js')
//sends back json object containing all notes
notesRouter.get('/', async(request, response) => {
    const notes = await Note.find({})
        response.json(notes)
    
})
//sends back a note matching given :id
notesRouter.get('/:id', (request, response, next) => {
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
notesRouter.delete('/:id', (request, response, next) => {
    Note.findByIdAndRemove(request.params.id)
        .then(result => {
        response.status(204).end()
    })
        .catch(error => next(error))
})
//Adds a new note to the notes array
notesRouter.post('/', async (request, response, next) => {
    const body = request.body 
    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date(),
        })
    try{
    const savedNote = await note.save()
    response.status(201).json(savedNote)}
    catch(exception) {
        next(exception)
    }
})
//modify content of  post
notesRouter.put('/:id', (request, response, next) => {
    const {content, important} = request.body
    Note.findByIdAndUpdate(request.params.id, {content, important}, {new: true, runValidators: true, context: 'query'})
        .then(updatedNote => {
            response.json(updatedNote)
        })
        .catch(error => next(error))
})
module.exports = notesRouter
