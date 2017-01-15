'use strict'

const imageSignature = require('./lib/image_signature.js')

module.exports = {
  generate: imageSignature.generate,
  distance: imageSignature.distance
}

