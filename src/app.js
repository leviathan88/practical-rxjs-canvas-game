import { Observable } from 'rxjs/Rx'

import { showScore, clearCanvas } from './elements'

// CONSTANTS
const ScoreInterval$ = Observable.interval(1000)

const Game$ = Observable.combineLatest(
    ScoreInterval$, (interval) => ({ interval })
)

Game$.subscribe(renderGameScene)

function renderGameScene({ interval }) {
    clearCanvas()
    showScore(interval * 10)
}