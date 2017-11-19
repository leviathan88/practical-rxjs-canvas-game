const sumLatest = (prev, curr) => prev + curr
const byDirection = key => key === 'a' || key === 'd'
const handlePlayerMovement = (prevX, key) => prevX + (key === 'a' ? -10 : 10)
const byEnterPress = key => key === 'Enter'
const byNotEmpty = input => !!input && input.trim().length > 0
const isDead = state => state

module.exports = {
    sumLatest,
    byDirection,
    handlePlayerMovement,
    byEnterPress,
    byNotEmpty,
    isDead
}