import server from './express'
import logger from './services/logger/'

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
