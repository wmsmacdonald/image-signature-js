'use strict'

const imageSignature = require('./lib/image_signature.js')

const signature = {
  generate: imageSignature.generate,
  distance: imageSignature.distance
}

if (typeof window === 'undefined') {
  module.exports = signature
}
else {
  window.imageSignature = signature
}

