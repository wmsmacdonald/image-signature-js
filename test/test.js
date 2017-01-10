/* global describe, it */

'use strict'

const assert = require('assert')
const _ = require('underscore')
const nj = require('../bower_components/numjs/dist/numjs')

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
  describe('#autoCrop()', function () {
    it('should not return a list with the element', function () {
      const data = nj.multiply(nj.random([100, 150]), 255)
      const image = nj.array(data.flatten().tolist().map(el => Math.floor(el))).reshape([100, 150])
      const cropped = imageSignature.autoCrop(image, 10, 90) 
      // should be about 90 in height
      assert(Math.abs(cropped.shape[0] - 80) < 7)
      // should be about 120 in width
      assert(Math.abs(cropped.shape[1] - 120) < 10)
    })
  })
})

