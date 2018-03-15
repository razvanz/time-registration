import server from './express'
import logger from './services/logger/'

// Default ENV VARS
process.env.JWT_VALIDITY = process.env.JWT_VALIDITY || 15 * 60 // 15 min
process.env.JWT_ALGORITHM = process.env.JWT_ALGORITHM || 'HS256'

const requiredEnvVars = [ 'DB_URL', 'SECURITY_SALT', 'JWT_SECRET' ]
const missingEnvVars = requiredEnvVars.filter(v => !process.env[v])
if (missingEnvVars.length) {
  throw new Error(`Missing environment variables: [${missingEnvVars.join(', ')}]`)
}

process.on('SIGTERM', () => handleExit(0))
process.on('SIGINT', () => handleExit(0))
process.on('unhandledException', (e) => {
  logger.fatal({ error: e })
  handleExit(1)
})

;(async () => {
  try {
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
//   const SUPERUSER = {
//     id: uuid(),
//     name: 'Super User',
//     email: 'su@timeregistration.com',
//     password: process.env.SUPERUSER_PASSWORD
//   }
//
//   await userDB.create(SUPERUSER)
//   await userScopeDB.create({ id: uuid(), userId: SUPERUSER.id, scope: 'admin' })
// })()
