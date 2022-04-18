const logger = require('./logger.js')
 //middleware called in order declared
//defines a middleware function
const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:', request.path)
    console.log('Body:', request.body)
    console.log('---')
    next()
}
//last middleware in chain. Handles failed requests
const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'})
}
const errorHandler = (error, request, response, next) => {
    console.log(error.message)
    if(error.name === 'CastError'){
        return response.status(400).send({error: 'malformatted id'})
    }
    else if(error.name === 'ValidationError'){
        return response.status(400).json({error: error.message})
    }
    next(error)
}
   
module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler
}
