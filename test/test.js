/* global describe, it */

'use strict'

const fs = require('fs')

const assert = require('assert')
const _ = require('underscore')
const nj = require('../bower_components/numjs/dist/numjs')
const image = require('get-image-data')

const imageSignature = require('../lib/image_signature')

describe('imageSignature', function () {
  describe('#generate()', function () {
    it('return array', function (cb) {
      const buf = fs.readFileSync(__dirname + '/fixtures/Reina_restaurant_Istanbul.jpg')
      image(buf, (err, imageData) => {
        if (err) return cb(err)
        //const signature = imageSignature.generate(imageData)
      })
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
  describe('#normalize()', function () {
    it('should return -2 for much darker', function () {
      const result = imageSignature.normalize(2, 50, -50, -72)
      assert.strictEqual(result, -2)
    })
    it('should return -1 for darker', function () {
      const result = imageSignature.normalize(2, 50, -50, -23)
      assert.strictEqual(result, -1)
    })
    it('should return 0 for same', function () {
      const result = imageSignature.normalize(2, 50, -50, 1)
      assert.strictEqual(result, 0)
    })
    it('should return 1 for lighter', function () {
      const result = imageSignature.normalize(2, 50, -50, 13)
      assert.strictEqual(result, 1)
    })
    it('should return 2 for much lighter', function () {
      const result = imageSignature.normalize(2, 50, -50, 64)
      assert.strictEqual(result, 2)
    })
  })
  describe('#computeGridAverages()', function () {
    it('should return the correct square for the top right corner ', function () {
      const image = nj.arange(1, 101).reshape(10,10)
      const neighborGroups = imageSignature.computeGridAverages(image, 10, 10)
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

