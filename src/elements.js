// import css
require('./style.css')

// CONSTANTS
const TEXT_COLOR = '#D500F9'
const TEXT_FONT = 'bold 30px Indie Flower'

// create canvas element and get its context
const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')

// set correct canvas width and height
canvas.width = window.innerWidth
canvas.height = window.innerHeight

// create input element
const input = document.createElement('input')
input.setAttribute('class', 'user-input')
input.setAttribute('placeholder', 'RESULT')
input.setAttribute('type', 'number')

// append elements to the document
document.body.appendChild(canvas)
document.body.appendChild(input)
input.focus()


// export functions
module.exports = {
    canvas,
    ctx,
    input,

    showScore,
    clearCanvas,
    showPlayer,
    showQuestion,
    clearInput
}

// context functions
function showScore(score) {
    ctx.fillStyle = TEXT_COLOR
    ctx.font = TEXT_FONT
    ctx.fillText(`SCORE: ${score}`, 40, 43)
}

function showQuestion(a, b, operator) {
    ctx.fillStyle = TEXT_COLOR
    ctx.font = TEXT_FONT
    ctx.fillText(`ENTER result: ${a} ${operator} ${b}`, canvas.width - 450, 43)
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

function clearInput() {
    input.value = ''
}