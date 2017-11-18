import { Observable, BehaviorSubject } from 'rxjs/Rx'

import { canvas, input } from './elements'
import { showScore, clearCanvas, showPlayer, showQuestion, clearInput, operations } from './elements'
import { byDirection, handlePlayerMovement, byEnterPress, byNotEmpty, multiplyNumbers, sumLatest } from './pure'

// GAME RELATED CONSTANTS
const PLAYER_Y_POSITION = canvas.height - 70
const PLAYER_STARTING_POSITION = canvas.width / 2
const OPERATIONS_INTERVAL_CHECK = 500
const SCORE_INTERVAL_RAISE = 5000
const SCORE_INTERVAL_POINTS = 100
const SCORE_CORRECT_POINTS = 50
const SCORE_PENALTY_POINTS = -50
const OPERATION_LIFETIME = 5000

// OBSERVABLE CONSTANTS
const CurrentOperationBehavior$ = new BehaviorSubject(operations.getOperationObject())
const ScoreBehavior$ = new BehaviorSubject(0)
const CurrentScore$ = ScoreBehavior$.scan(sumLatest)
const ScoreInterval$ = Observable.interval(SCORE_INTERVAL_RAISE).map(() => SCORE_INTERVAL_POINTS)
const PlayerEnterPress$ = Observable.fromEvent(input, 'keyup').pluck('key').filter(byEnterPress)
const OperationsInterval$ = Observable.interval(500)

const PlayerMovement$ = Observable.fromEvent(document, 'keyup')
    .merge(Observable.fromEvent(document, 'keydown'))
    .pluck('key')
    .filter(byDirection)
    .scan(handlePlayerMovement, PLAYER_STARTING_POSITION)
    .startWith(PLAYER_STARTING_POSITION)

const LatestOperation$ = Observable.merge(
        PlayerEnterPress$.map(value => ({ value })),
        OperationsInterval$.map(() => ({ value: Date.now() }))
    )
    .filter(({ value }) => value === 'Enter' || (value - CurrentOperationBehavior$.getValue().timestamp >= OPERATION_LIFETIME))
    .map(({ value }) => Number(input.value) === CurrentOperationBehavior$.getValue().result ? SCORE_CORRECT_POINTS : SCORE_PENALTY_POINTS)
    .do(clearInput)
    .do(() => CurrentOperationBehavior$.next(operations.getOperationObject()))

Observable.merge(
    ScoreInterval$,
    LatestOperation$
).subscribe(score => ScoreBehavior$.next(score))

// MAIN GAME OBSERVABLE
const Game$ = Observable.combineLatest(
    CurrentScore$, PlayerMovement$, CurrentOperationBehavior$,
    (score, playerX, operation) => ({ score, playerX, operation })
)

function renderGameScene({ score, playerX, operation }) {
    clearCanvas()
    showScore(score)
    showPlayer({ x: playerX, y: PLAYER_Y_POSITION })
    showQuestion(operation.a, operation.b, operation.operator)
}

Game$.subscribe(renderGameScene)