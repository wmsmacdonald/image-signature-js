'use strict'

describe('canvas', function () {
  it('get image data from canvas context', function () {
    return createImageData('fixtures/istanbul_small.jpg')
  })
})

describe('imageSignature', function() {
  it('#generate', function() {
    return createImageData('fixtures/istanbul_small.jpg').then(imageData => {
      const signature = window.imageSignature.generate(imageData)
      const isZero = x => x === 0 ? true + 1 : false

      const zeros = signature.reduce((zeros, arr) => arr.filter(isZero).length + zeros, 0)
    })
  })
  it('#distance', function() {
    return Promise.all([createImageData('fixtures/istanbul_small.jpg'), 
      createImageData('fixtures/istanbul_medium.jpg')]).then(([imageData1, imageData2]) => {

      const signature1 = window.imageSignature.generate(imageData1)
      const signature2 = window.imageSignature.generate(imageData2)

      const distance = window.imageSignature.distance(signature1, signature2)
    })
  })
})

function createImageData(imageUrl) {
  const img = new Image()
  img.src = imageUrl
  return new Promise((resolve, reject) => {
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const context = canvas.getContext("2d")
      context.drawImage(img, 0, 0, 100, 100)
      resolve(context.getImageData(0, 0, 100, 100))
    }
  })
}
