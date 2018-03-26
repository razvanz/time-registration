import angular from 'angular'
import routes from './users.routes'
import modelJsonTransform from './directives/model-json-transform'
import UsersDataSvc from './users.data.svc'
import UsersCtrl from './users.ctrl'

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
  .directive('trModelJsonTransform', modelJsonTransform)
  .service('UsersDataSvc', UsersDataSvc)
  .controller('UsersCtrl', UsersCtrl)
