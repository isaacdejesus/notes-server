const notesRouter = require('express').Router()
const Note = require('../models/note.js')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if(authorization && authorization.toLowerCase().startsWith('bearer ')){
        return authorization.substring(7)
    }
    return null
}
//sends back json object containing all notes
notesRouter.get('/', async(request, response) => {
    const notes = await Note.find({}).populate('User', {username: 1, name: 1})
        response.json(notes)
})
//sends back a note matching given :id
notesRouter.get('/:id', async (request, response, next) => {
    const note = await Note.findById(request.params.id)
            if(note)
                response.json(note)
            else
                response.status(404).end()
})
//deletes a note based on :id
notesRouter.delete('/:id', async (request, response, next) => {
     await Note.findByIdAndRemove(request.params.id)
        response.status(204).end()
    })
//Adds a new note to the notes array
notesRouter.post('/', async (request, response, next) => {
    const body = request.body 
    const token = getTokenFrom(request)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if(!decodedToken.id){
        return response.status(401).json({error: 'token missing or invalid'})
    }
    const user = await User.findById(decodedToken.id)
    console.log(user._id)
    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date(),
        user: user._id
        })
    const savedNote = await note.save()
    user.notes = user.notes.concat(savedNote._id)
    await user.save()
    response.status(201).json(savedNote)
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
