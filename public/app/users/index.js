import angular from 'angular'
import routes from './users.routes'
import UsersDataSvc from './users.data.svc'

require('angular-animate')
require('angular-touch')
require('@uiRouter/angularjs')
require('angular-ui-bootstrap')
require('../config')
require('../templates')
require('../auth')

export default angular
  .module('tr.users', [
    'ngAnimate',
    'ngTouch',
    'ui.router',
    'ui.bootstrap',
    'tr.config',
    'tr.templates',
    'tr.auth'
  ])
  .config(routes)
  .service('UsersDataSvc', UsersDataSvc)
