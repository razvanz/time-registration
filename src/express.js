import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import requestId from 'express-request-id'
import { resolve as pathResolve } from 'path'
import ExpressServerError from './express-server-error'
import errors from './errors'
import logger from './services/logger'
import {
  errorHandler,
  errorLogger,
  errorSerializer,
  handlingLogger,
  handle404
} from './middleware/'

const HOST = process.env.HTTP_HOST || '0.0.0.0'
const PORT = process.env.HTTP_PORT || 80
const server = express()
const createError = ExpressServerError.factory(errors || {})

server.disable('x-powered-by')
server.set('trust proxy', true)
server.use(express.static(pathResolve(__dirname, './public')))
server.use(cors())
server.use(requestId({ attributeName: 'requestId', setHeader: true }))
server.use(bodyParser.urlencoded({ extended: true }))
server.use(bodyParser.json({ type: (req) => req.is(['*/json', '*/*+json']) }))
server.use((req, res, next) => {
  req.locals = req.app.locals
  req.locals.createError = createError
  req.locals.logger = logger.with(req) // create a contextual logger

  next()
})
server.use(handlingLogger())

server.all('/health', (req, res) => { res.send('OK') }) // Health check
// TODO Authentication
// TODO Routers

server.use(handle404())
server.use(errorLogger())
server.use(errorHandler({ type: ExpressServerError, createFn: createError }))
server.use(errorSerializer())

server.HOST = HOST
server.PORT = PORT
server.listen = server.listen.bind(server, PORT, HOST)

module.exports = server