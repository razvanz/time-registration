import server from './express'
import logger from './services/logger/'
import db from './services/db'

// Default ENV VARS
process.env.JWT_VALIDITY = process.env.JWT_VALIDITY || 15 * 60 // 15 min
process.env.JWT_ALGORITHM = process.env.JWT_ALGORITHM || 'HS256'

process.on('SIGTERM', () => handleExit(0))
process.on('SIGINT', () => handleExit(0))
process.on('unhandledException', (e) => {
  logger.fatal({ error: e })
  handleExit(1)
})

;(async () => {
  try {
    await db.init()
    await server.listen()
    logger.info(`Started HTTP server on ${server.HOST}:${server.PORT}`)
  } catch (e) {
    logger.fatal({ error: e })
  }
})()

function handleExit (code) {
  logger.info('Process exited', { code })
  process.exit(code)
}

// ;(async () => {
//   const uuid = require('uuid')
//   const userDB = require('./services/db').userDB
//   const SUPERUSER = {
//     id: uuid(),
//     name: 'Super User',
//     email: 'su@tr.com',
//     password: process.env.SUPERUSER_PASSWORD,
//     scope: ['user', 'manager', 'admin']
//   }
//
//   await userDB.create(SUPERUSER)
// })()
