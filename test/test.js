/* global describe, it */

'use strict'

const assert = require('assert')
const _ = require('underscore')

const imageSignature = require('../lib/image_signature')

describe('imageSignature', function () {
  describe('#autoCrop()', function() {
    it('should return a NDArray', function() {
    })
  })
  
  describe('#getNeighbors()', function () {
    it('should not return a list with the element', function () {
      let arr = [0, 1, 2, 3]
      let neighbors = imageSignature.getNeighbors(1, arr)
      assert.strictEqual(_.indexOf(neighbors, 1), -1)
    })
    it('should return the correct values for 3x3 with target at middle', function () {
      let arr = _.range(9)
      let neighbors = imageSignature.getNeighbors(4, arr)
      assert(_.isEqual(neighbors, [0, 1, 2, 3, 5, 6, 7, 8]))
    })
    it('should return the correct values for 3x3 with target at top', function () {
      let arr = _.range(9)
      let neighbors = imageSignature.getNeighbors(1, arr)
      assert(_.isEqual(neighbors, [0, 2, 3, 4, 5]))
    })
    it('should return the correct values for 3x3 with target at left', function () {
      let arr = _.range(9)
      let neighbors = imageSignature.getNeighbors(3, arr)
      assert(_.isEqual(neighbors, [0, 1, 4, 6, 7]))
    })
    it('should return the correct values for 3x3 with target at bottom right', function () {
      let arr = _.range(9)
      let neighbors = imageSignature.getNeighbors(8, arr)
      assert(_.isEqual(neighbors, [4, 5, 7]))
    })
  })
})

