'use strict'

const nj = require('../bower_components/numjs/dist/numjs')
const assert = require('assert')
const _ = require('underscore')

const njUtil = require('../lib/nj_util')

describe('njUtil', function() {
  describe('diff', function() {
    it('should return the correct array', function() {
      const arr = nj.array([1, 2, 3])  
      const diff = njUtil.diff(arr)  
      assert.strictEqual(diff.get(0), 1)
      assert.strictEqual(diff.get(1), 1)
    })
  })
})
