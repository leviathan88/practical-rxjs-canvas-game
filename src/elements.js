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
    showScore,
    clearCanvas
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