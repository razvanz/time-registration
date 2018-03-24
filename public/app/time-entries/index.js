import angular from 'angular'
import routes from './time-entries.routes'
import modelISODate from './directives/model-iso-date'
import modelHoursFrom from './directives/model-hours-from'
import duration from './filters/duration'
import groupByDay from './filters/group-by-day'
import TimeEntriesDataSvc from './time-entries.data.svc'
import TimeEntriesCtrl from './time-entries.ctrl'

require('angular-animate')
require('angular-touch')
require('@uiRouter/angularjs')
require('angular-ui-bootstrap')
require('../config')
require('../templates')
require('../auth')
require('../users')

export default angular
  .module('tr.time-entries', [
    'ngAnimate',
    'ngTouch',
    'ui.router',
    'ui.bootstrap',
    'tr.config',
    'tr.templates',
    'tr.auth',
    'tr.users'
  ])
  .config(routes)
  .filter('duration', duration)
  .filter('groupByDay', groupByDay)
  .directive('trModelIsoDate', modelISODate)
  .directive('trModelHoursFrom', modelHoursFrom)
  .service('TimeEntriesDataSvc', TimeEntriesDataSvc)
  .controller('TimeEntriesCtrl', TimeEntriesCtrl)
