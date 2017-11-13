const sumLatest = (prev, curr) => prev + curr
const byDirection = key => key === 'ArrowLeft' || key === 'ArrowRight'
const handlePlayerMovement = (prevX, key) => prevX + (key === 'ArrowLeft' ? -10 : 10)

module.exports = {
    sumLatest,
    byDirection,
    handlePlayerMovement,
}