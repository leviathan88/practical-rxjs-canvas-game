import { Observable, BehaviorSubject } from 'rxjs/Rx'

import { canvas, input } from './elements'
import { showScore, clearCanvas, showPlayer, showQuestion, clearInput, operations, showFlakes } from './elements'
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

const EvilBloodFlakes$ = Observable.interval(500)
    .scan(flakes => {
        const flake = {
            x: parseInt(Math.random() * canvas.width),
            y: 0,
            radius: parseInt((Math.random() * 10) + 5)
        }

        flakes.forEach(flake => {
            flake.y += 50
        })

        flakes.push(flake)
        return flakes.filter(flake => !(flake.y > canvas.height))
    }, [])

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
    .map(() => Number(input.value) === CurrentOperationBehavior$.getValue().result ? SCORE_CORRECT_POINTS : SCORE_PENALTY_POINTS)
    .do(clearInput)
    .do(() => CurrentOperationBehavior$.next(operations.getOperationObject()))

Observable.merge(
    ScoreInterval$,
    LatestOperation$
).subscribe(points => ScoreBehavior$.next(points))

// MAIN GAME OBSERVABLE
const Game$ = Observable.combineLatest(
    CurrentScore$, PlayerMovement$, CurrentOperationBehavior$, EvilBloodFlakes$,
    (score, playerX, operation, flakes) => ({ score, playerX, operation, flakes })
).sample(Observable.interval(50))

function renderGameScene({ score, playerX, operation, flakes }) {
    clearCanvas()
    showScore(score)
    showPlayer({ x: playerX, y: PLAYER_Y_POSITION })
    showQuestion(operation.a, operation.b, operation.operator)
    showFlakes(flakes)
}

Game$.subscribe(renderGameScene)