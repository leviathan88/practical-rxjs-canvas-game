const sumLatest = (prev, curr) => prev + curr
const byDirection = key => key === 'a' || key === 'd'
const handlePlayerMovement = (prevX, key) => prevX + (key === 'a' ? -10 : 10)
const byEnterPress = key => key === 'Enter'
const byNotEmpty = input => !!input && input.trim().length > 0

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
    handleUserInput,
    byEnterPress,
    byNotEmpty
}