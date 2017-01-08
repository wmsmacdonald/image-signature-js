'use strict';

const nj = require('../bower_components/numjs/dist/numjs')
const _ = require('underscore')

// https://github.com/numpy/numpy/blob/v1.10.1/numpy/lib/function_base.py#L1116-L1175
function diff(a, n, axis) {
  axis = axis === undefined ? 0 : axis
  n = n === undefined ? -1 : n
  if (n === 0) {
    return a
  }
  
  let nd = a.shape.length
  let slice1 = _.map(_.range(nd), el => [null, null, null])
  let slice2 = _.map(_.range(nd), el => [null, null, null])
  slice1[axis] = 1
  slice2[axis] = [null, -1]
  if (n > 1) {
    return diff(a.slice(...slice1).subtract(a.slice(...slice2), n - 1, axis))
  }
  else {
    return a.slice(...slice1).subtract(a.slice(...slice2))
  }
}

module.exports = {
  diff
}
