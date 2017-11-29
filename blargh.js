import {Matrix} from 'ml-matrix'

const TRAINING_ITERATIONS = 10000

const PALETTE_SIZE = 2 
const MATRIX_SIZE = 16 

// format a number as a hex string with leading zeros
const asHex = i => ("000000" + i.toString(16)).substr(-6)

// map color to a hex code
const palette = color => `#${asHex(color * (0xffffff / (PALETTE_SIZE- 1)))}`

function getPixelSize(canvas, pixels) {
  return canvas.height / pixels.length
}

function init() {
  const pixels = Matrix.randInt(MATRIX_SIZE, MATRIX_SIZE, PALETTE_SIZE)
  setupClickHandler(pixels)
  draw(pixels)
}

init()

// draws a given pixel matrix to the canvas
function draw(pixels) {
  const canvas = document.querySelector('canvas')
  const pixelSize = getPixelSize(canvas, pixels)
  const ctx = canvas.getContext('2d')
  pixels.forEach((row, y) =>
    row.forEach((color, x) => {
      ctx.fillStyle = palette(color)
      ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize)
    })
  )
}

function setupClickHandler(pixels) {
  const canvas = document.querySelector('canvas')
  const pixelSize = getPixelSize(canvas, pixels)
  canvas.addEventListener('click', ({ clientX, clientY }) => {
    const rect = canvas.getBoundingClientRect()
    const x = Math.floor((clientX - rect.left) / pixelSize)
    const y = Math.floor((clientY - rect.top) / pixelSize)
    console.log(x, y)
    pixels.set(y, x, Number(!pixels.get(y, x)))
    draw(pixels)
  })
}


// sigmoid function (?)
const sigmoid = (x, deriv=false) => {
  const ones = Matrix.ones(x.length, x[0].length)
  if (deriv) {
    // x * (1 - x)
    return Matrix.mul(x, Matrix.sub(ones, x))
  }
  // 1 / (1 + exp(-x))
  return Matrix.div(ones,
    Matrix.add(ones,
      Matrix.exp(Matrix.mul(x, -1))))
}

const input = new Matrix([
  [0, 0, 1],
  [0, 1, 1],
  [1, 0, 1],
  [1, 1, 1],
])

const output = new Matrix([[0], [0], [1], [1]])

function trainNeuralNet(input, output) {
  let syn0 = Matrix.sub(Matrix.mul(Matrix.rand(3, 1), 2), 1)
  let l1;

  for (let i = 0; i < TRAINING_ITERATIONS; i += 1) {
    let l0 = input
    l1 = sigmoid(l0.mmul(syn0))

    const l1_error = Matrix.sub(output, l1)
    const l1_delta = Matrix.mul(l1_error, sigmoid(l1, true))

    syn0 = Matrix.add(syn0, l0.transpose().mmul(l1_delta))
  }

  console.dir(l1)
}

//trainNeuralNet(input, output)
