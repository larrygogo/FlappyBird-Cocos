import { _decorator, Component, instantiate, Node, Prefab, Vec3, view, log, UITransform, Canvas } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BackgroundController')
export class BackgroundController extends Component {
    // 背景图组
    @property(Prefab)
    backgroundPrefab: Prefab | null = null;
    speed: number = 50;
    count: number = 0;

    start() {
        if (!this.backgroundPrefab) {
            return;
        }
        this.calcScale();
        this.calcCount();
        this.generateBackground();
    }

    update(deltaTime: number) {
        
        if (this.node.children.length === 0) {
            return;
        }

        const distance = this.speed * deltaTime;

        for (const bg of this.node.children) {
            this.moveBackgrounds(bg, distance);
        }

        const firstBackground = this.node.children[0];
        const firstBackgroundPosition = firstBackground.getPosition();
        const backgroundWidth = (this.backgroundPrefab.data.getComponent(UITransform).contentSize.width - 12) * this.backgroundPrefab.data.getComponent(UITransform).node.scale.x;
        log(backgroundWidth)
        // 如果第一个背景图已经完全移出屏幕，则销毁
        if (firstBackgroundPosition.x + backgroundWidth < - view.getViewportRect().width / 2) {
            this.distroyBackground(firstBackground);
            this.addBackground();
        }
       
    }

    calcScale() {
        if (!this.backgroundPrefab) {
            return;
        }
        const prefabUIComponent = this.backgroundPrefab.data.getComponent(UITransform);
        prefabUIComponent.setContentSize(prefabUIComponent.contentSize.width * prefabUIComponent.node.scale.x, prefabUIComponent.contentSize.height * prefabUIComponent.node.scale.y);
    }

    calcCount() {
        // 获取屏幕宽度
        const width = view.getViewportRect().width;
        const prefabUIComponent = this.backgroundPrefab.data.getComponent(UITransform);
        const backgroundWidth = prefabUIComponent.contentSize.width - 12 * prefabUIComponent.node.scale.x;
        this.count = Math.ceil(width / backgroundWidth) + 2;
    }

    addBackground() {
        const background = instantiate(this.backgroundPrefab);
        background.setPosition(this.getNewPosition());
        this.node.addChild(background);
    }


    generateBackground() {
        for (let i = 0; i < this.count; i++) {
            this.addBackground();
        }
    }


    distroyBackground(background: Node) {
        const index = this.node.children.indexOf(background);
        if (index > -1) {
            this.node.removeChild(background);
            background.destroy();
        }
    }

    moveBackgrounds(background: Node, distance: number) {
        background.setPosition(background.position.x - distance, background.position.y, background.position.z);
    }

    getNewPosition(): Vec3 {
        if (this.node.children.length === 0) {
            // 屏幕最左边
            return new Vec3(-view.getVisibleSize().width / 2, 0, 0);
        }
        const lastBackground = this.node.children[this.node.children.length - 1];
        const lastBackgroundUIComponent = lastBackground.getComponent(UITransform);
        const lastBackgroundPosition = lastBackground.getPosition();
        return new Vec3(lastBackgroundPosition.x + (lastBackgroundUIComponent.contentSize.width - 12) * lastBackground.scale.x, 0, 0);
    }
}

