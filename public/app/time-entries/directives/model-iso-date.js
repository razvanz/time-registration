function modelISODate () {
  return {
    restrict: 'A',
    require: 'ngModel',
    priority: 1,
    link: function (scope, elem, attrs, ctrl) {
      const format = val => val
        ? (!isNaN(new Date(val).getTime()) ? new Date(val) : undefined)
        : null
      const parse = val => val
        ? (!isNaN(new Date(val).getTime()) ? new Date(val).toISOString() : undefined)
        : null

      ctrl.$formatters.push(format)
      ctrl.$parsers.push(parse)
    }
  }
}

export default modelISODate
