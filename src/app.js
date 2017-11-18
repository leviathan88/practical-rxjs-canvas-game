import { Observable } from 'rxjs/Rx'

import { canvas, input } from './elements'
import { showScore, clearCanvas, showPlayer, showQuestion, clearInput } from './elements'
import { byDirection, handlePlayerMovement, byEnterPress, byNotEmpty, multiplyNumbers, operations } from './pure'

// GAME RELATED CONSTANTS
const PLAYER_Y_POSITION = canvas.height - 70
const PLAYER_STARTING_POSITION = canvas.width / 2

// OBSERVABLE CONSTANTS
const ScoreInterval$ = Observable.interval(1000)
const PlayerEnterPress$ = Observable.fromEvent(input, 'keyup').pluck('key').filter(byEnterPress)
const OperationsTimer$ = Observable.timer(0, 5000)

const PlayerMovement$ = Observable.fromEvent(document, 'keyup')
    .merge(Observable.fromEvent(document, 'keydown'))
    .pluck('key')
    .filter(byDirection)
    .scan(handlePlayerMovement, PLAYER_STARTING_POSITION)
    .startWith(PLAYER_STARTING_POSITION)

const LatestValue$ = PlayerEnterPress$
    .switchMap(() => Observable.of(input.value))
    .do(clearInput)

const NewOperation$ = Observable.merge(
    PlayerEnterPress$,
    OperationsTimer$
).switchMap(() => Observable.of(operations.getOperationObject()))

const CheckResults$ = LatestValue$.withLatestFrom(
    NewOperation$
).subscribe(console.log)

// MAIN GAME OBSERVABLE
const Game$ = Observable.combineLatest(
    ScoreInterval$, PlayerMovement$, NewOperation$,
    (interval, playerX, o) => ({ interval, playerX, o })
)

function renderGameScene({ interval, playerX, o }) {
    clearCanvas()
    showScore(interval * 10)
    showPlayer({ x: playerX, y: PLAYER_Y_POSITION })
    showQuestion(o.a, o.b, o.r)
}

Game$.subscribe(renderGameScene)