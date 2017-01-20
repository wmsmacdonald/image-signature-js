'use strict'

describe('canvas', function () {
  it('get image data from canvas context', function () {
    return createImageData()
  })
})

describe('imageSignature', function() {
  it('#generate', function() {
    return createImageData().then(imageData => {
      const signature = window.imageSignature.generate(imageData)

      const isZero = x => x === 0 ? true + 1 : false

      const zeros = signature.reduce((zeros, arr) => arr.filter(isZero).length + zeros, 0)
      console.log('zeros', zeros) 
      console.log(signature)
    })
  })
})

function createImageData() {
  const img = new Image()
  img.src = 'fixtures/istanbul_small.jpg'
  return new Promise((resolve, reject) => {
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const context = canvas.getContext("2d")
      context.drawImage(img, 0, 0, 100, 100)
      resolve(context.getImageData(0, 0, 100, 100))
    }
  })
}
