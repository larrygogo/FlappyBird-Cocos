import { _decorator, Component, Node, Vec3, Animation } from 'cc';
const { ccclass, property } = _decorator;

enum PlayerState {
    IDLE,
    FLY,
    DIE
}

@ccclass('PlayerController')
export class PlayerController extends Component {
    @property(Animation)
    playerAnimation: Animation | null = null;

    state: PlayerState = PlayerState.IDLE;

    position: Vec3 = new Vec3();


    start() {
    }

    update(deltaTime: number) {
        if (this.state === PlayerState.IDLE) {
            return;
        } else if (this.state === PlayerState.FLY) {
            this.position.y += 200 * deltaTime;
            this.node.setPosition(this.position);
        } else if (this.state === PlayerState.DIE) {
            this.position.y -= 200 * deltaTime;
            this.node.setPosition(this.position);
        }
    }

    fly() {
        this.state = PlayerState.FLY;
        this.playerAnimation?.play('fly');
    }


}

