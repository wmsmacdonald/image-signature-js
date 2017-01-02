'use strict';

const assert = require('assert');

const imageSignature = require('../lib/image_signature');

describe('imageSignature', function() {
  describe('#grayscale()', function() {
    it('should return an array a quarter of the size with the average of RGB values', function() {
      let size = 100;
      let value = 40;
      let imageData = new Uint8ClampedArray(size).fill(value);
      let grayscaled = imageSignature.grayscale(imageData);
      assert.strictEqual(grayscaled.length, size / 4, 'result array must be a quarter of the size');
      let allSame = grayscaled.every(el => el === value);
      assert(allSame, 'result array must be same as starting values');
    });
    it('should return an array with the proper average', function() {
      let imageData = new Uint8ClampedArray([1, 2, 3, 155, 1, 2, 2]);
      let grayscaled = imageSignature.grayscale(imageData);
      assert.strictEqual(grayscaled[0], 2);
      assert.strictEqual(grayscaled[1], 5 / 3);
    });
  });
});


