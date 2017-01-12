'use strict'

const nj = require('../bower_components/numjs/dist/numjs')
const assert = require('assert')
const _ = require('underscore')

const njUtil = require('../lib/nj_util')

describe('njUtil', function() {
  describe('#diff()', function() {
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
  describe('#sum()', function() {
    it('should return the correct array with axis not given', function() {
      const arr = nj.array([0.5, 1.5])
      const sum = njUtil.sum(arr)
      const expected = 2.0
      assert.strictEqual(sum, expected)
    })
    it('should return the correct array for 2D array', function() {
      const arr = nj.array([[0, 1], [0, 5]])
      const sum = njUtil.sum(arr)
      const expected = 6
      assert.strictEqual(sum, expected)
    })
    it('should return the correct array for 2D array with axis 0', function() {
      const arr = nj.array([[0, 1], [0, 5]])
      const sum = njUtil.sum(arr, 0)
      const expected = nj.array([0, 6]) 
      assert(nj.equal(sum, expected))
    })
    it('should return the correct array for 2D array with axis 1', function() {
      const arr = nj.array([[0, 1], [0, 5]])
      const sum = njUtil.sum(arr, 1)
      const expected = nj.array([1, 5]) 
      assert(nj.equal(sum, expected))
    })
  })
  describe('#cumsum()', function() {
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
    it('should return the correct array for axis = 1', function() {
      const arr = nj.array([[1, 2, 3], [4, 5, 6]])
      const cumsum = njUtil.cumsum(arr, 1)
      const expected = nj.array([[1, 3, 6], [4, 9, 15]])
      assert(nj.equal(cumsum, expected))
    })
  })
  describe('#searchsorted()', function() {
    it('should return the correct index for existing element', function() {
      const arr = nj.array([1, 2, 3, 4, 5])
      const index = njUtil.searchsorted(arr, 3)
      assert.strictEqual(index, 2)
    })
    it('should return the correct index for non existing element', function() {
      const arr = nj.array([1, 2, 3, 5])
      const index = njUtil.searchsorted(arr, 4)
      assert.strictEqual(index, 3)
    })
  })
  describe('#vectorize()', function() {
    it('should return the correct array', function() {
      const arr = nj.array([[1, 2], [3, 4]])
      const result = njUtil.vectorize(arr, (e, i) => e + i)
      const expected = nj.array([[1, 3], [5, 7]])
      assert(nj.equal(result, expected))
    })
  })
  describe('#getNeighbors()', function () {
    it('should return the correct neighbors for top left including itself', function () {
      const arr = nj.arange(1, 10).reshape(3, 3)
      const neighbors = njUtil.getNeighbors(arr, 0, 0, -1, 1, true)
      const expected = nj.array([1, 2, 4, 5])
      assert(nj.equal(neighbors, expected))
    })
    it('should return the correct neighbors for top left excluding itself', function () {
      const arr = nj.arange(1, 10).reshape(3, 3)
      const neighbors = njUtil.getNeighbors(arr, 0, 0, -1, 1, false)
      const expected = nj.array([2, 4, 5])
      assert(nj.equal(neighbors, expected))
    })
  })
})

