const app = require('./app')
const http = require('http')
const config = require('./utils/config.js')
const logger = require('./utils/logger.js')
const server = http.createServer(app)
server.listen(config.PORT, () => {
    logger.info(`server running on port ${config.PORT}`)
})

