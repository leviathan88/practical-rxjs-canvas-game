const sumLatest = (prev, curr) => prev + curr
const byDirection = key => key === 'a' || key === 'd'
const handlePlayerMovement = (prevX, key) => prevX + (key === 'a' ? -10 : 10)
const byNumericalInput = value => value && !isNaN(value)

const handleUserInput = ({ data, srcElement }, { value }) => {
    console.log(data)
    console.log(srcElement)
    console.log(value)

    return data + value
}
module.exports = {
    sumLatest,
    byDirection,
    handlePlayerMovement,
    byNumericalInput,
    handleUserInput,
}