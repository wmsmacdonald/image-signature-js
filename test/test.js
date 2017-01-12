/* global describe, it */

'use strict'

const assert = require('assert')
const _ = require('underscore')
const nj = require('../bower_components/numjs/dist/numjs')

const imageSignature = require('../lib/image_signature')

describe('imageSignature', function () {
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
  describe('#computeGridAverages()', function () {
    it('should return the correct square for the top right corner ', function () {
      const image = nj.arange(1, 101).reshape(10,10)
      const neighborGroups = imageSignature.computeGridAverages(image, 10, 10, 2)
      // square should be [1, 2, 11, 12]
      const expected = (1 + 2 + 11 + 12) / 4
      const result = neighborGroups.get(0,0)
      assert.strictEqual(result, expected)
    })
    it('should return the correct square for the middle', function () {
      const image = nj.arange(1, 101).reshape(10,10)
      const neighborGroups = imageSignature.computeGridAverages(image, 10, 10)
      // square should be [45, 46, 55, 56]
      const expected = (45 + 46 + 55 + 56) / 4
      const result = neighborGroups.get(4, 4)
      assert.strictEqual(result, expected)
    })
    it('should return the correct square for the bottom right corner', function () {
      const image = nj.arange(1, 101).reshape(10,10)
      const neighborGroups = imageSignature.computeGridAverages(image, 10, 10)
      // square should be [89, 90, 99, 100]
      const expected = (89 + 90 + 99 + 100) / 4
      const result = neighborGroups.get(8, 8)
      assert.strictEqual(result, expected)
    })
  })
})

