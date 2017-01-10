'use strict';

const nj = require('../bower_components/numjs/dist/numjs')
const _ = require('underscore')

// https://github.com/numpy/numpy/blob/v1.10.1/numpy/lib/function_base.py#L1116-L1175
function diff(a, n, axis) {
  // default to 
  n = n === undefined ? 1 : n
  if (n === 0) {
    return a
  }
  if (n < 0) {
    throw new Error('order must be non-negative but got ' + n)
  }
  
  let nd = a.shape.length
  let slice1 = _.map(_.range(nd), el => [null])
  let slice2 = _.map(_.range(nd), el => [null])
  // default to last axis
  axis = axis === undefined ? nd - 1 : axis
  slice1[axis] = 1
  slice2[axis] = [null, -1]
  if (n > 1) {
    return diff(a.slice(...slice1).subtract(a.slice(...slice2), n - 1, axis))
  }
  else {
    return a.slice(...slice1).subtract(a.slice(...slice2))
  }
}

function sum(a, axis) {
  if (axis === undefined) {
    return a.flatten().sum()
  }

  const nd = a.shape.length
  const axisLength = a.shape[axis]
  const sliceShape = a.shape.slice()
  sliceShape.splice(axis, 1)

  if (sliceShape.length === 0) {
    // get cumulative sum of array (splice to discard initial 0)
    return nj.array(scanLeft(0, a.tolist(), (prev, curr) => prev + curr).slice(1))
  }
  else {
    let slice = _.map(_.range(nd), el => [null, null, null])

    let sumSlice = nj.zeros(sliceShape)
    // LOOP INVARIANT: result is the cum sum up to i on the axis
    for (let i = 0; i < axisLength; i++) {
      // slice array at i on the given axis
      slice[axis] = [i, i + 1]
      const row = a.slice(...slice).reshape(...sliceShape)
      sumSlice = sumSlice.add(row)
    }
    return sumSlice
  }
}


// TODO test for array rank > 2
function cumsum(a, axis) {
  if (axis === undefined) {
    return cumsum(a.flatten(), 0)
  }

  const nd = a.shape.length
  const axisLength = a.shape[axis]
  const sliceShape = a.shape.slice()
  sliceShape.splice(axis, 1)

  if (sliceShape.length === 0) {
    // get cumulative sum of array (splice to discard initial 0)
    return nj.array(scanLeft(0, a.tolist(), (prev, curr) => prev + curr).slice(1))
  }
  else {
    let slice = _.map(_.range(nd), el => [null, null, null])

    const result = []
    let sumSlice = nj.zeros(sliceShape)
    // LOOP INVARIANT: result is the cum sum up to i on the axis
    for (let i = 0; i < axisLength; i++) {
      // slice array at i on the given axis
      slice[axis] = [i, i + 1]
      const row = a.slice(...slice).reshape(...sliceShape)
      sumSlice = sumSlice.add(row)
      // add the sum to the result array
      result.push(sumSlice.tolist())
    }
    const axes = _.range(0, a.shape.length)
    axes[0] = axis
    axes[axis] = 0
    return nj.array(result).transpose(axes)  
  }
}

// http://stackoverflow.com/questions/22697936/binary-search-in-javascript
function searchsorted(a, v) {
  let m = 0;
  let n = a.shape[0] - 1
  while (m <= n) {
    const k = (n + m) >> 1
    const cmp = v - a.get(k)
    if (cmp > 0) {
      m = k + 1
    } 
    else if (cmp < 0) {
      n = k - 1
    } 
    else {
      return k
    }
  }
  return m
}

// produces a collection containing cumulative results of applying the operator going left to right
function scanLeft(initial, arr, operator) {
  const newArray = [initial] 
  _.reduce(arr, (memo, el) => {
    const result = operator(memo, el)
    newArray.push(result)
    return result
  }, initial)
  return newArray
}

module.exports = {
  diff,
  sum,
  cumsum,
  searchsorted
}
