'use strict'

const nj = require('../bower_components/numjs/dist/numjs')
const assert = require('assert')
const _ = require('underscore')

const njUtil = require('../lib/nj_util')

describe('njUtil', function() {
  describe('array_equals', function() {
    it('should return true for equal arrays', function() {
      const arr1 = nj.array([1, 2, 3])
      const arr2 = nj.array([1, 2, 3])
      assert(njUtil.array_equals(arr1, arr2))
    })
    it('should return true for equal arrays', function() {
      const arr1 = nj.array([1, 2, 3])
      const arr2 = nj.array([1, 2, 3])
      assert(njUtil.array_equals(arr1, arr2))
    })
  })
  describe('diff', function() {
    it('should return the correct array for a 3x1 array', function() {
      const arr = nj.array([1, 2, 4, 7, 0])  
      const diff = njUtil.diff(arr)  
      const expected = nj.array([1, 2, 3, -7])
      console.log(diff)
      assert(njUtil.array_equals(diff, expected))
    })
    it('should return the correct array for a 2x3 array', function() {
      const arr = nj.array([[1, 2, 3], [1, 2, 3]])  
      const diff = njUtil.diff(arr)  
      const expected = nj.array([[1, 1], [1, 1]])
      assert(njUtil.array_equals(diff, expected))
    })
  })
})

