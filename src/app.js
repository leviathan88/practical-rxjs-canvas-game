import { Observable, BehaviorSubject } from 'rxjs/Rx'

import { canvas, input } from './elements'
import { showScore, clearCanvas, showPlayer, showQuestion, clearInput, getOperationObject, showFlakes, createFlake, detectCollision } from './elements'
import { byDirection, handlePlayerMovement, byEnterPress, byNotEmpty, multiplyNumbers, sumLatest, isDead } from './pure'


// GAME RELATED CONSTANTS
const PLAYER_Y_POSITION = canvas.height - 70
const PLAYER_STARTING_POSITION = canvas.width / 2
const OPERATIONS_INTERVAL_CHECK = 500
const SCORE_INTERVAL_RAISE = 5000
const SCORE_INTERVAL_POINTS = 100
const SCORE_CORRECT_POINTS = 50
const SCORE_PENALTY_POINTS = -50
const OPERATION_LIFETIME = 5000
const FLAKE_FREQUENCY = 500
const FLAKE_DROP_SPEED = 50

// OBSERVABLE CONSTANTS
const CurrentOperationBehavior$ = new BehaviorSubject(getOperationObject())
const ScoreBehavior$ = new BehaviorSubject(0)
const IsAlive$ = new BehaviorSubject(true)
const CurrentScore$ = ScoreBehavior$.scan(sumLatest)
const ScoreInterval$ = Observable.interval(SCORE_INTERVAL_RAISE).map(() => SCORE_INTERVAL_POINTS)
const PlayerEnterPress$ = Observable.fromEvent(input, 'keyup').pluck('key').filter(byEnterPress)
const OperationsInterval$ = Observable.interval(500)
const FlakeCreator$ = Observable.interval(FLAKE_FREQUENCY).map(_ => createFlake())

const EvilBloodFlakes$ = FlakeCreator$
    .scan((flakes, flake) => [...flakes, flake].filter(flake => !(flake.y > canvas.height)), [])
    .map(flakes => {
        flakes.forEach(flake => {
            flake.y += FLAKE_DROP_SPEED
        })
        return flakes
    }).share()

const PlayerMovement$ = Observable.fromEvent(document, 'keyup')
    .merge(Observable.fromEvent(document, 'keydown'))
    .pluck('key')
    .filter(byDirection)
    .scan(handlePlayerMovement, PLAYER_STARTING_POSITION)
    .startWith(PLAYER_STARTING_POSITION)
    .filter(x => !(x > canvas.width - 50 || x < 50))

const LatestOperation$ = Observable.merge(
        PlayerEnterPress$.map(value => ({ value })),
        OperationsInterval$.map(() => ({ value: Date.now() }))
    )
    .filter(({ value }) => value === 'Enter' || (value - CurrentOperationBehavior$.getValue().timestamp >= OPERATION_LIFETIME))
    .map(() => Number(input.value) === CurrentOperationBehavior$.getValue().result ? SCORE_CORRECT_POINTS : SCORE_PENALTY_POINTS)
    .do(clearInput)
    .do(() => CurrentOperationBehavior$.next(getOperationObject()))

Observable.merge(
    ScoreInterval$,
    LatestOperation$
).subscribe(points => ScoreBehavior$.next(points))

// MAIN GAME OBSERVABLE
const Game$ = Observable.combineLatest(
    CurrentScore$, PlayerMovement$, CurrentOperationBehavior$, EvilBloodFlakes$,
    (score, playerX, operation, flakes) => ({ score, playerX, operation, flakes })
).sample(Observable.interval(50))

Observable.combineLatest(
        EvilBloodFlakes$,
        PlayerMovement$
    ).map(([flakes, x]) => detectCollision(flakes, { x, y: PLAYER_Y_POSITION }))
    .filter(isDead)
    .subscribe(_ => IsAlive$.next(false))

// START THE GAME
Game$.takeWhile(() => IsAlive$.getValue()).subscribe(renderGameScene)

function renderGameScene({ score, playerX, operation, flakes }) {
    clearCanvas()
    showScore(score)
    showPlayer({ x: playerX, y: PLAYER_Y_POSITION })
    showQuestion(operation.a, operation.b, operation.operator)
    showFlakes(flakes)
}