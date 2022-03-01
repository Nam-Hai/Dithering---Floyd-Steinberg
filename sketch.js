let w = 500;
let h = 500;
let density = 4;
let inputImg;


function preload() {
  img = loadImage('assets/image.jpg');
}

function setup() {
  // input = createFileInput(handleFile);
  // input.position(0, 0);



  pixelDensity(density);
  createCanvas(w, h)
  background(0);

  // capture = createCapture(VIDEO);
  // capture.size(w, h);
  // capture.hide();
  dithering()


}

function draw() {
  // if (inputImg) {
  //   image(inputImg, 0, 0, width, height);
  // }
}

function cartesianToIndex(x, y) {
  return 4 * (y * density * width * density + x * density);
}


function quantize(oldValue, impact) {
  return round(impact * oldValue / 255) * 255 / impact;;
}

function handleFile(file) {
  print(file);
  if (file.type === 'image') {
    img = createImg(file.data, '');
    img.hide();
  } else {
    img = null;
  }
}

function dithering() {
  w = w / density;
  h = h / density;

  image(img, 0, 0, w, h);
  filter(GRAY);
  loadPixels();




  let oldPixel = 0;
  let newPixel = 0;
  let quant_error = 0;

  for (let j = 0; j < h - 1; j++) {
    for (let i = 1; i < w - 1; i++) {
      let index = cartesianToIndex(i, j);
      oldPixel = pixels[index];

      newPixel = quantize(oldPixel, 1);
      pixels[index] = newPixel;
      pixels[index + 1] = newPixel;
      pixels[index + 2] = newPixel;

      // pas besoins de calculer quant_error sur chaque couleur car nous somme en grayscale
      quant_error = oldPixel - newPixel;

      for (let a = 0; a < 3; a++) {

        pixels[cartesianToIndex(i + 1, j) + a] = pixels[cartesianToIndex(i + 1, j) + a] + quant_error * 7 / 16;
        pixels[cartesianToIndex(i - 1, j + 1) + a] = pixels[cartesianToIndex(i - 1, j + 1) + a] + quant_error * 3 / 16;
        pixels[cartesianToIndex(i, j + 1) + a] = pixels[cartesianToIndex(i, j + 1) + a] + quant_error * 5 / 16;
        pixels[cartesianToIndex(i + 1, j + 1) + a] = pixels[cartesianToIndex(i + 1, j + 1) + a] + quant_error * 1 / 16;
      }

      let d = pixelDensity();
      for (let i2 = 0; i2 < d; i2++) {
        for (let j2 = 0; j2 < d; j2++) {
          // loop over
          let index2 = 4 * ((j * d + j2) * width * d + (i * d + i2));
          pixels[index2] = pixels[index];
          pixels[index2 + 1] = pixels[index];
          pixels[index2 + 2] = pixels[index];
          pixels[index2 + 3] = 255;

        }
      }
    }
  }
  pixelDensity(1);
  updatePixels();

}