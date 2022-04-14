const express = require('express')
const cors = require('cors')
const app = express()
let notes = [
    {
        id: 1,
        content: "HTML is easy",
        date: "2022-05-30T17:30:31.098Z",
        important: true
    },
    {
        id: 2,
        content: "Browser can execute only JavaScript",
        date: "2022-05-30T17:30:31.098Z",
        important: false
    },
    {
        id: 3,
        content: "HTML is easy",
        date: "2022-05-30T17:30:31.098Z",
        important: false
    }

]
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
    response.json(notes)
})
//sends back a note matching given :id
app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id) //cast to Number because :id comes in as a string
    const note = notes.find(note => note.id === id)
    if(note)
        response.json(note)
    else
        response.status(404).end() //if not found return 404
})
//deletes a note based on :id
app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id) 
    notes = notes.filter(note => note.id !== id) //create a new object array without the note
    response.status(204).end()  //reeturn 204 response
})
const generateId = () => {
    const maxId = notes.length > 0
        ? Math.max(...notes.map(n=> n.id))
        : 0
    return maxId + 1
}
//Adds a new note to the notes array
app.post('/api/notes', (request, response) => {
    const body = request.body 
    if(!body.content) {
        return response.status(400).json({
            error: 'content missing'
        })
        const note = {
            content: body.content,
            important: body.important || false,
            date: new DAte(),
            id: generateId,
        }
        notes.notes.concat(note)
        response.json(note)
    }
})
//last middleware in chain. Handles failed requests
const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'})
}
app.use(unknownEndpoint)
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
