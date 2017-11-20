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

// create play again button
const button = document.createElement('button')
button.setAttribute('class', 'hidden')
button.innerHTML = 'Play Again'

// append elements to the document
document.body.appendChild(canvas)
document.body.appendChild(input)
document.body.appendChild(button)
input.focus()

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

function showFlakes(flakes) {
    const startAngle = 0 * (Math.PI / 180)
    const endAngle = 360 * (Math.PI / 180)

    ctx.strokeStyle = '#af111c'
    ctx.fillStyle = '#af111c'
    ctx.lineWidth = 1

    flakes.forEach(({ x, y, radius }) => {
        ctx.beginPath()
        ctx.arc(x, y, radius, startAngle, endAngle, false)
        ctx.fill()
        ctx.stroke()
    })
}

function createFlake() {
    return {
        x: getRandomNumber(canvas.width),
        y: 0,
        radius: parseInt((Math.random() * 10) + 5)
    }
}

function clearInput() {
    input.value = ''
}

function hideButton() {
    button.setAttribute('class', 'hidden')
}

function showButton() {
    button.setAttribute('class', 'button')
}

// Collision Logic
const distance = 50

function detectCollision(flakes, player) {
    return flakes.some(flake => isCollision(flake, player))
}

function isCollision(flake, player) {
    return (flake.x > player.x - distance && flake.x < player.x + distance) && (flake.y > player.y - distance && flake.y < player.y + distance)
}

// Random Numbers logic
const operationsMap = new Map([
    [0, '+'],
    [1, '-'],
    [2, '*']
])

const operations = {
    getRandomOperationNumber: () => getRandomNumber(3),
    getRandomLargeNumber: () => getRandomNumber(100) + 1,
    getRandomSmallNumber: () => getRandomNumber(20) + 1,
    getOperator: i => operationsMap.get(i),
    calculate: o => performOperations(o),
    getOperationObject: () => {

        const operator = operations.getOperator(operations.getRandomOperationNumber())
        const a = operations.getRandomSmallNumber()
        const b = operations.getRandomSmallNumber()
        const result = operations.calculate(operator)(a, b)

        return {
            operator,
            a,
            b,
            result,
            timestamp: Date.now()
        }
    }
}

function getOperationObject() {
    return operations.getOperationObject()
}

function performOperations(operator) {
    return function(a, b) {
        switch (operator) {
            case '*':
                return a * b
            case '+':
                return a + b
            case '-':
                return a - b
        }
    }
}

function getRandomNumber(range) {
    return parseInt(Math.random() * range)
}

// export functions
module.exports = {
    canvas,
    input,
    button,

    showScore,
    clearCanvas,
    showPlayer,
    showQuestion,
    clearInput,
    showFlakes,
    createFlake,
    getOperationObject,
    detectCollision,
    showButton,
    hideButton
}