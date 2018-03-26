import { authenticate } from './middleware'
import AuthController from './controllers/auth'
import TimeEntryController from './controllers/time-entry'
import UserController from './controllers/user'
import UtilsController from './controllers/utils'

export default function registerRoutes (router) {
  // OAuth2 token
  router.route('/oauth2/token').post(AuthController.token)

  // Register
  router.route('/register').post(UserController.create)

  // Ueers
  router.route('/user')
    .get(authenticate('user'), UserController.list)
    .post(authenticate('manager'), UserController.create)

  router.use('/user/:id', authenticate('user'), UserController.load)
  router.route('/user/:id')
    .get(UserController.get)
    .put(UserController.update)
    .delete(authenticate('manager'), UserController.delete)

  // Time entries
  router.use('/time-entry', authenticate('user')) // require user access rights
  router.route('/time-entry')
    .get(TimeEntryController.list)
    .post(TimeEntryController.create)

  router.use('/time-entry/:id', TimeEntryController.load)
  router.route('/time-entry/:id')
    .get(TimeEntryController.get)
    .put(TimeEntryController.update)
    .delete(TimeEntryController.delete)

  router.use(UtilsController.handleErrors)
  router.use(AuthController.errorHandler) // Map OAuthError(s) to ServerError
}
