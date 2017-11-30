import {Matrix} from 'ml-matrix'

const TRAINING_ITERATIONS = 10000

// sigmoid function (?)
function sigmoid(x, deriv=false) {
  const ones = Matrix.ones(x.length, x[0].length)
  if (deriv) {
    // x * (1 - x)
    return Matrix.mul(x, Matrix.sub(ones, x))
  }
  // 1 / (1 + exp(-x))
  return Matrix.div(
    ones,
    Matrix.add(
      ones,
      Matrix.exp(Matrix.mul(x, -1))
    )
  )
}

export default function trainNeuralNet(input, output) {
  let synapse = Matrix.sub(
    Matrix.mul(
      Matrix.rand(input[0].length, output[0].length),
      2
    ),
    1
  )

  for (let i = 0; i < TRAINING_ITERATIONS; i += 1) {
    let layer0 = input
    let layer1 = sigmoid(layer0.mmul(synapse))

    const layer1Error = Matrix.sub(output, layer1)
    const layer1Delta = Matrix.mul(layer1Error, sigmoid(layer1, true))

    synapse = Matrix.add(synapse, layer0.transpose().mmul(layer1Delta))
  }

  // return a prediction function
  return (toPredict) => sigmoid(toPredict.mmul(synapse))
}
