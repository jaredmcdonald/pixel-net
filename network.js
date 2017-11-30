import {Matrix} from 'ml-matrix'

const TRAINING_ITERATIONS = 10000

export function relu(x, deriv = false) {
  const zeros = Matrix.zeros(x.length, x[0].length)
  if (deriv) {
    return new Matrix(x.map(row => row.map(i => (i <= 0 ? 0 : 1))))
  }
  return Matrix.max(zeros, x)
}

// sigmoid function (?)
export function sigmoid(x, deriv = false) {
  const ones = Matrix.ones(x.length, x[0].length)
  if (deriv) {
    // x * (1 - x)
    return Matrix.mul(x, Matrix.sub(ones, x))
  }
  // 1 / (1 + exp(-x))
  return Matrix.div(ones, Matrix.add(ones, Matrix.exp(Matrix.mul(x, -1))))
}

export default function trainNeuralNet(input, output, nonlin = sigmoid) {
  // initialize hidden layer
  let synapse = Matrix.sub(
    Matrix.mul(Matrix.rand(input[0].length, output[0].length), 2),
    1
  )

  for (let i = 0; i < TRAINING_ITERATIONS; i += 1) {
    let layer0 = input

    // make a prediction
    let layer1 = nonlin(layer0.mmul(synapse))

    // how far off were we?
    const layer1Error = Matrix.sub(output, layer1)

    // normalize error by multiplying by the derivative (i think...?)
    const layer1Delta = Matrix.mul(layer1Error, nonlin(layer1, true))

    // add our normalized error to the hidden layer
    synapse = Matrix.add(synapse, layer0.transpose().mmul(layer1Delta))
  }

  // return a prediction function
  return toPredict => nonlin(toPredict.mmul(synapse))
}
