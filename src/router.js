import { authenticate } from './middleware'
import AuthController from './controllers/auth'
import Router from 'router'

const router = new Router()

// Obtain an OAuth2 token
router.route('/oauth2/token').post(AuthController.token)

router.route('/secret')
  .get(authenticate('user'), (req, res) => res.send('secret'))

// TODO Routers

// Map OAuthError(s) to ServerError
router.use(AuthController.errorHandler)

export default router
