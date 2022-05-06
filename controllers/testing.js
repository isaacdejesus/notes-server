const testingRouter = require('express').Router()
const Note = require('../models/note.js')
const User = require('../models/user.js')
testingRouter.post('/reset', async (request, response) => {
    await Note.deleteMany({})
    await User.deleteMany({})
    response.status(204).end()
})

module.exports =  testingRouter
