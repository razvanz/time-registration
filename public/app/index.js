// window.jQuery = window.jquery = window.$ = require('jquery')
const angular = require('angular')

require('angular-animate')
require('angular-touch')
require('@uiRouter/angularjs')
require('angular-ui-bootstrap')
require('angular-toastr')
require('./infinite-scroll')
require('./auth')
require('./config')
require('./templates')
require('./public')
require('./users')
require('./time-entries')

angular
  .module('tr', [
    'ngAnimate',
    'ngTouch',
    'ui.router',
    'ui.bootstrap',
    'toastr',
    'tr.infinite-scroll',
    'tr.auth',
    'tr.config',
    'tr.templates',
    'tr.public',
    'tr.users',
    'tr.time-entries'
  ])
  .config(['$logProvider', ($logProvider) => {
    // enable or disable based on preference
    $logProvider.debugEnabled(true)
  }])
  .config(['$locationProvider', ($locationProvider) => {
    $locationProvider.hashPrefix('')
  }])
  .config(['toastrConfig', function (toastrConfig) {
    angular.extend(toastrConfig, {
      autoDismiss: true,
      closeButton: false,
      tapToDismiss: false,
      newestOnTop: true,
      maxOpened: 2,
      timeOut: 5000,
      extendedTimeOut: 5000,
      progressBar: true,
      positionClass: 'toast-bottom-center',
      showEasing: 'swing',
      hideEasing: 'linear',
      showMethod: 'fadeIn',
      hideMethod: 'fadeOut'
    })
  }])
  .config(['OAuth2Provider', (OAuth2Provider) => {
    OAuth2Provider.configure({
      clientId: 'CeXXc6iZOXHYIp2ymFcWLZD3uAd1v6hvBazN',
      clientSecret: 'O90q3A8SSIQ3ZNItgxI4T90xVJp8NREm8ENpAczOyDHhjkh8Lg4jhAI2yyh91mtM'
    })
  }])
  .config(require('./index.routes').default)
  .run([
    '$rootScope', 'OAuth2', '$transitions', '$state', 'DEFAULT_STATE', '$log', 'toastr',
    ($rootScope, OAuth2, $transitions, $state, DEFAULT_STATE, $log, toastr) => {
      $log.info('Application started')

      $state.defaultErrorHandler(angular.noop)
      $transitions.onError({}, (transition) => {
        const { detail: error } = transition.error()
        $log.error('transition error', error)

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
            $state.go(DEFAULT_STATE)
            break
          default:
            $log.error(error)
            break
        }
      })

      $rootScope.$on('oauth2:error', (event, error) => {
        // is $state is transitioning let the handler above do it's job
        if ($state.transition) return

        if (['E_INVALID_GRANT', 'E_INVALID_REQUEST'].includes(error.code)) {
          if ($state.current.name !== 'login') {
            $log.error('$rootScope:oauth2:error', 'redirect through login to', $state.current)

            $state.go('login', {
              e: 'Your session has expired. Please login to continue.',
              redirect: $state.current
            })
          }
        }
      })
    }])
