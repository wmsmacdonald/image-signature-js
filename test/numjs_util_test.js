'use strict'

const nj = require('../bower_components/numjs/dist/numjs')
const assert = require('assert')
const _ = require('underscore')

const njUtil = require('../lib/nj_util')

describe('njUtil', function() {
  describe('diff', function() {
    it('should return the correct array for a 3x1 array', function() {
      const arr = nj.array([1, 2, 4, 7, 0])  
      const diff = njUtil.diff(arr)  
      const expected = nj.array([1, 2, 3, -7])
      assert(nj.equal(diff, expected))
    })
    it('should return the correct array for a 2x3 array', function() {
      const arr = nj.array([[1, 2, 3], [1, 2, 3]])  
      const diff = njUtil.diff(arr)  
      const expected = nj.array([[1, 1], [1, 1]])
      assert(nj.equal(diff, expected))
    })
    it('should return the correct array for a 2x3 array on axis 0', function() {
      const arr = nj.array([[1, 2, 3], [1, 2, 3]])  
      const diff = njUtil.diff(arr, 1, 0)  
      const expected = nj.array([[0, 0, 0]])
      assert(nj.equal(diff, expected))
    })
    it('should return the correct array for a array with n = 2', function() {
      const arr = nj.array([1, 2, 4, 7, 0])  
      const diff = njUtil.diff(arr, 2)  
      const expected = nj.array([1, 1, -10])
      assert(nj.equal(diff, expected))
    })
  })
  describe('cumsum', function() {
    it('should return the correct array with axis not given', function() {
      const arr = nj.array([[1, 2, 3], [4, 5, 6]])
      const cumsum = njUtil.cumsum(arr)
      const expected = nj.array([1, 3, 6, 10, 15, 21])
      assert(nj.equal(cumsum, expected))
    })
    it('should return the correct array for axis = 0', function() {
      const arr = nj.array([[1, 2, 3], [4, 5, 6]])
      const cumsum = njUtil.cumsum(arr, 0)
      const expected = nj.array([[1, 2, 3], [5, 7, 9]])
      assert(nj.equal(cumsum, expected))
    })
  })
})

