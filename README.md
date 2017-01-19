# image-signature-js
Pure JS function that generates a hash for a canvas image that can be used to identify similar images


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

The signature is an array of 81 arrays, one for each grid point in a 10x10 grid.  Each array contains comparisons of grid pieces of image with each other (much darker, darker, same, lighter, much lighter). The algorithm used to generate the signature is based on the method described in [Goldberg, et al](http://www.cs.cmu.edu/~hcwong/Pdfs/icip02.ps).

The calculated "distance" is a measure of the similarity between the images. It is computed as the normalized L2 norm of the signature, as described in the Goldberg paper.
