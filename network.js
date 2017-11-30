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

export default function trainNeuralNet(
  input,
  output,
  nonlin = sigmoid,
  numLayers = 1
) {
  const synapses = []
  // initialize hidden layers
  for (let i = 0; i < numLayers; i += 1) {
    synapses[i] = Matrix.sub(
      Matrix.mul(Matrix.rand(input[0].length, output[0].length), 2),
      1
    )
  }

  for (let i = 0; i < TRAINING_ITERATIONS; i += 1) {
    const layers = [input] // manually set first layer to the input

    // feed thru the network and make a prediction (residing in last layer)
    for (let j = 1; j <= numLayers; j += 1) {
      layers[j] = nonlin(layers[j - 1].mmul(synapses[j - 1]))
    }

    const deltas = []
    for (let j = numLayers; j >= 1; j -= 1) {
      // how far off were we?
      const layerError = Matrix.sub(output, layers[j])

      // normalize error by multiplying by the derivative (i think...?)
      deltas[j] = Matrix.mul(layerError, nonlin(layers[j], true))
    }

    // add our normalized error to the hidden layer
    for (let j = numLayers - 1; j >= 0; j -= 1) {
      synapses[j] = Matrix.add(
        synapses[j],
        layers[j].transpose().mmul(deltas[j + 1])
      )
    }
  }

  // return a prediction function
  return toPredict => {
    const layers = [toPredict]
    for (let j = 1; j <= numLayers; j += 1) {
      layers[j] = nonlin(layers[j - 1].mmul(synapses[j - 1]))
    }
    return layers[numLayers - 1]
  }
}
