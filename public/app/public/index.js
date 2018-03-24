import angular from 'angular'
import routes from './public.routes'
import LoginCtrl from './login/login.ctrl'
import RegisterCtrl from './register/register.ctrl'

require('@uiRouter/angularjs')
require('angular-ui-bootstrap')
require('../auth')
require('../config')
require('../templates')

export default angular
  .module('tr.public', [
    'ui.router',
    'ui.bootstrap',
    'tr.auth',
    'tr.config',
    'tr.templates'
  ])
  .config(routes)
  .controller('LoginCtrl', LoginCtrl)
  .controller('RegisterCtrl', RegisterCtrl)
