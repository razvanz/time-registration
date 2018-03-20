require('babel-polyfill')

const angular = require('angular')

require('@uiRouter/angularjs')
require('angular-ui-bootstrap')
require('./config')
require('./templates')
require('./auth')
require('./public')

angular
  .module('tr', [
    'ui.router',
    'ui.bootstrap',
    'tr.config',
    'tr.templates',
    'tr.auth',
    'tr.public'
  ])
  .config(['$logProvider', ($logProvider) => {
    // enable or disable based on preference
    $logProvider.debugEnabled(true)
  }])
  .config(['OAuth2Provider', (OAuth2Provider) => {
    OAuth2Provider.configure({
      clientId: 'CeXXc6iZOXHYIp2ymFcWLZD3uAd1v6hvBazN',
      clientSecret: 'O90q3A8SSIQ3ZNItgxI4T90xVJp8NREm8ENpAczOyDHhjkh8Lg4jhAI2yyh91mtM'
    })
  }])
  .config(require('./index.routes').default)
  .run([
    '$rootScope', 'OAuth2', '$transitions', '$state', '$log',
    ($rootScope, OAuth2, $transitions, $state, $log) => {
      $log.info('Application started')

      $state.defaultErrorHandler(angular.noop)
      $transitions.onError({}, (transition) => {
        const { detail: error } = transition.error()

        switch (error.code) {
          case 'E_INVALID_TOKEN':
          case 'E_INVALID_GRANT':
            transition.abort()
            $state.go('login', {
              e: error.message,
              redirect: transition.to()
            })
            break
          case 'E_AUTHENTICATED':
            transition.abort()
            $state.go('index')
            break
          default:
            $log.error(error)
            break
        }
      })
    }])
