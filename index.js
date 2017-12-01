import {Matrix} from 'ml-matrix'
import trainNeuralNet from './network'
import draw, {getPixelSize} from './draw'

const MATRIX_SIZE = 16
const TRAINING_ROWS = 100

function setupHandlers(pixels, net) {
  const canvas = document.querySelector('canvas')
  const pixelSize = getPixelSize(canvas, pixels)
  canvas.addEventListener('click', ({clientX, clientY}) => {
    const rect = canvas.getBoundingClientRect()
    const x = Math.floor((clientX - rect.left) / pixelSize)
    const y = Math.floor((clientY - rect.top) / pixelSize)

    if (x <= MATRIX_SIZE / 2 - 1) {
      // only allow drawing on the left side
      pixels.set(y, x, Number(!pixels.get(y, x)))
      draw(pixels)
    }
  })

  document.querySelector('button').addEventListener('click', () => {
    // take the left half
    const input = pixels.subMatrix(0, MATRIX_SIZE - 1, 0, MATRIX_SIZE / 2 - 1)
    // and give it to the neural net
    const output = net(input)

    output.forEach((row, y) =>
      row.forEach((value, colIndex) => {
        const x = colIndex + MATRIX_SIZE / 2
        pixels.set(y, x, normalize(value))
      })
    )
    draw(pixels)
  })
}

function normalize(n) {
  return Math.round(n)
}

function generateTrainingSet(fn) {
  const input = Matrix.rand(
    TRAINING_ROWS,
    MATRIX_SIZE / 2,
    () => Math.round(Math.random()) // 1 or 0
  )
  for (let i = 0; i < TRAINING_ROWS / 2; i += 1) {
    // add some all-zero rows because that's pretty common in practice
    input.addRow(Matrix.zeros(1, MATRIX_SIZE / 2))
  }
  const output = new Matrix(input.map(fn))
  return {input, output}
}

// kick everything off (rollup wraps it all in a closure)
const pixels = Matrix.zeros(MATRIX_SIZE, MATRIX_SIZE)
draw(pixels)

// some functions to generate fake training data
const mirror = row => row.slice().reverse()
const not = row => row.map(i => Number(!i))
const mirrorNot = row => mirror(not(row))

const {input, output} = generateTrainingSet(mirrorNot)
const net = trainNeuralNet(input, output)
setupHandlers(pixels, net)
