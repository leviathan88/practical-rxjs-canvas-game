import { Observable } from 'rxjs/Rx'

import { canvas } from './elements'
import { showScore, clearCanvas, showPlayer } from './elements'
import { byDirection, handlePlayerMovement } from './pure'

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

function renderGameScene({ interval, playerX }) {
    clearCanvas()
    showScore(interval * 10)
    showPlayer({ x: playerX, y: PLAYER_Y_POSITION })
}

const Game$ = Observable.combineLatest(
    ScoreInterval$, PlayerMovement$,
    (interval, playerX) => ({ interval, playerX })
)

Game$.subscribe(renderGameScene)