const PALETTE_SIZE = 2

// format a number as a hex string with leading zeros
const asHex = i => ("000000" + i.toString(16)).substr(-6)

// map color to a hex code
const palette = color => `#${asHex(color * (0xffffff / (PALETTE_SIZE - 1)))}`

const getPixelSize = (canvas, pixels) => canvas.height / pixels.length

export {getPixelSize};

// draws a given pixel matrix to the canvas
export default function draw(pixels) {
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
