// import css
require('./style.css')

// create canvas element and get its context
const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')

// set correct canvas width and height
canvas.width = window.innerWidth
canvas.height = window.innerHeight

// append elements to the document
document.body.appendChild(canvas)

// export functions
module.exports = {
    canvas,
    ctx,

    showScore,
    clearCanvas,
    showPlayer,
}

// context functions
function showScore(score) {
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 26px sans-serif'
    ctx.fillText(`Your SCORE: ${score}`, 40, 43)
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}

function showPlayer({ x, y }) {
    ctx.beginPath();
    ctx.arc(x, y, 50, 0.2 * Math.PI, 1.8 * Math.PI, false)

    // The mouth
    // A line from the end of the arc to the centre
    ctx.lineTo(x, y)

    // A line from the centre of the arc to the start
    ctx.closePath()

    // Fill the pacman shape with yellow
    ctx.fillStyle = "yellow"
    ctx.fill()

    // Draw the black outline (optional)
    ctx.stroke()

    // Draw the eye
    ctx.beginPath()
    ctx.arc(x, y - 25, 10, 0, 2 * Math.PI, false)
    ctx.fillStyle = "rgb(0, 0, 0)"
    ctx.fill()
}