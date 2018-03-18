import { authenticate } from './middleware'
import Router from 'router'
import AuthController from './controllers/auth'
import TimeEntryController from './controllers/time-entry'
import UtilsController from './controllers/utils'

const router = new Router()

// Obtain an OAuth2 token
router.route('/oauth2/token').post(AuthController.token)

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

router.use(UtilsController.handleValidationErrors)
router.use(AuthController.errorHandler) // Map OAuthError(s) to ServerError

export default router
