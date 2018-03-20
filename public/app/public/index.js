import angular from 'angular'
import routes from './public.routes'
import LoginCtrl from './login/login.ctrl'
import RegisterCtrl from './register/register.ctrl'

export default angular
  .module('tr.public', [
    'tr.auth'
  ])
  .config(routes)
  .controller('LoginCtrl', LoginCtrl)
  .controller('RegisterCtrl', RegisterCtrl)
