import moment from 'moment'

function modelHoursFrom () {
  return {
    restrict: 'A',
    require: 'ngModel',
    priority: 0,
    scope: {
      from: '<trModelHoursFrom'
    },
    link: function (scope, elem, attrs, ctrl) {
      const format = val => {
        if (!scope.from) return 0
        if (!val) return null
        if (isNaN(new Date(val).getTime())) return undefined

        return Math.round(moment(val).diff(moment(scope.from), 'hours', true) * 10 * 2) / 10 / 2
      }
      const parse = val => {
        if (!scope.from) return null
        if (!val) return null
        if (isNaN(parseFloat(val))) return undefined

        return moment(scope.from).add(parseFloat(val), 'hours').toDate()
      }
      const minValidator = val => ctrl.$isEmpty(val) ||
        moment(val).diff(moment(scope.from), 'hours', true) >= parseFloat(attrs.min)
      const maxValidator = val => ctrl.$isEmpty(val) ||
        moment(val).diff(moment(scope.from), 'hours', true) <= parseFloat(attrs.max)
      const stepValidator = val => ctrl.$isEmpty(val) ||
        moment(val).diff(moment(scope.from), 'hours', true) % parseFloat(attrs.step) === 0

      ctrl.$formatters.push(format)
      ctrl.$parsers.push(parse)

      if (ctrl.$validators.min) {
        ctrl.$validators.min = minValidator
      }
      if (ctrl.$validators.max) {
        ctrl.$validators.max = maxValidator
      }
      if (ctrl.$validators.step) {
        ctrl.$validators.step = stepValidator
      }

      scope.$watch('from', function (newVal) {
        const val = ctrl.$viewValue
        ctrl.$setViewValue(null, 'change')
        ctrl.$setViewValue(val, 'change')
      })
    }
  }
}

export default modelHoursFrom
