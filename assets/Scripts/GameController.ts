import { _decorator, Component, Node } from 'cc';
import { PlayerController } from './PlayerController';
const { ccclass, property } = _decorator;

export enum GameState {
    INIT,
    PLAYING,
    END
}

@ccclass('GameController')
export class GameController extends Component {
    @property({type: PlayerController})
    playerController: PlayerController | null = null;

    start() {

    }

    update(deltaTime: number) {
        
    }
}

