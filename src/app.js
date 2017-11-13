import { Observable } from 'rxjs/Rx'

import { canvas, input } from './elements'
import { showScore, clearCanvas, showPlayer, showQuestion } from './elements'
import { byDirection, handlePlayerMovement, byNumericalInput, handleUserInput } from './pure'

// GAME RELATED CONSTANTS
const PLAYER_Y_POSITION = canvas.height - 70
const PLAYER_STARTING_POSITION = canvas.width / 2

// OBSERVABLE CONSTANTS
const ScoreInterval$ = Observable.interval(1000)

const PlayerMovement$ = Observable.fromEvent(document, 'keyup')
    .merge(Observable.fromEvent(document, 'keydown'))
    .pluck('key')
    .filter(byDirection)
    .scan(handlePlayerMovement, PLAYER_STARTING_POSITION)
    .startWith(PLAYER_STARTING_POSITION)

const PlayerInput$ = Observable.fromEvent(input, 'input')
    .pluck('srcElement', 'value')
    .scan((prev, curr) => !isNaN(curr) ? curr : prev, '')
    .subscribe(e => input.value = e)

// MAIN GAME OBSERVABLE
const Game$ = Observable.combineLatest(
    ScoreInterval$, PlayerMovement$,
    (interval, playerX) => ({ interval, playerX })
)

function renderGameScene({ interval, playerX }) {
    clearCanvas()
    showScore(interval * 10)
    showPlayer({ x: playerX, y: PLAYER_Y_POSITION })
    showQuestion(12, 14, '+')
}

Game$.subscribe(renderGameScene)