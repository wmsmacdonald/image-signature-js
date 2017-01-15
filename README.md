# image-signature-js
JS function that generates a hash for a canvas image that can be used to identify similar images


```javascript
const signature = require('image-signature')

// getting image data from canvas
let canvas = document.createElement('canvas');
let context = canvas.getContext('2d');
let img = document.getElementById('foo');
context.drawImage(img, 0, 0 );
let imageData = context.getImageData(0, 0, img.width, img.height);

// calculating the signature
let sig = signature.generate(imageData)
// finding the "distance" (similarity) between two images
let distance = signature.distance(sig1, sig2)
```
