const sumLatest = (prev, curr) => prev + curr
const byDirection = key => key === 'a' || key === 'd'
const handlePlayerMovement = (prevX, key) => prevX + (key === 'a' ? -10 : 10)
const byEnterPress = key => key === 'Enter'
const byNotEmpty = input => !!input && input.trim().length > 0
const operationsMap = new Map([
    [0, '+'],
    [1, '-'],
    [2, '*'],
    [3, '/']
])

const operations = {
    getRandomOperationNumber: () => getRandomNumber(4),
    getRandomLargeNumber: () => getRandomNumber(101),
    getRandomSmallNumber: () => getRandomNumber(21),
    getOperator: i => operationsMap.get(i),
    calculate: o => performOperations(o),
    getOperationObject: () => ({ r: operations.getOperator(operations.getRandomOperationNumber()), a: operations.getRandomSmallNumber(), b: operations.getRandomSmallNumber() })
}


module.exports = {
    sumLatest,
    byDirection,
    handlePlayerMovement,
    byEnterPress,
    byNotEmpty,
    operations
}

function performOperations(operator) {
    return function(a, b) {
        switch (operator) {
            case '*':
                return a * b
            case '/':
                return a / b
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