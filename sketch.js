let w = 500;
let h = 500;
let density = 1;
let quantizeRatio = 2;
let inputImg;
let canvas;


function preload() {
  curImg = loadImage('assets/image.jpg');
}

function setup() {
  pixelDensity(density);
  canvas = createCanvas(w, h)
  background(0);
  dithering(curImg)



  input = createFileInput(handleFile);
  let div0 = createDiv();
  div0.addClass("slider-container")
  sliderQuantize = createSlider(1, 10, quantizeRatio, 1);
  sliderQuantize.style('width', '300px')
  div0.child(createSpan('Quantize Ratio : '))
  div0.child(sliderQuantize);

  let div1 = createDiv();
  sliderDensity = createSlider(1, 15, density, 1);
  sliderDensity.style('width', '300px')
  div1.addClass("slider-container")
  div1.child(createSpan('Resolution : '))
  div1.child(sliderDensity);

  let div2 = createDiv();
  buttonSave = createButton('save');
  div2.addClass('center')
  div2.child(buttonSave)
  buttonSave.mousePressed(saveImg);

}

function draw() {
  sliderQuantize.changed(sliderEvent);
  sliderDensity.changed(sliderEvent)

  if (inputImg) {
    curImg = inputImg;
    dithering(curImg);
    inputImg = null;
  }
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
    inputImg = createImg(file.data, '');
    inputImg.hide();
  } else {
    inputImg = null;
  }
}

function dithering(img) {
  w = w / density;
  h = h / density;
  pixelDensity(density);

  image(img, 0, 0, w, h);
  filter(GRAY);
  loadPixels();




  let oldPixel = 0;
  let newPixel = 0;
  let quant_error = 0;

  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) {
      let index = cartesianToIndex(i, j);
      oldPixel = pixels[index];

      newPixel = quantize(oldPixel, quantizeRatio);
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

  w = 500;
  h = 500;
}

function sliderEvent() {
  quantizeRatio = sliderQuantize.value();
  density = sliderDensity.value();
  dithering(curImg);
}

function saveImg() {
  save(canvas, 'imageDithered.png', true)
}