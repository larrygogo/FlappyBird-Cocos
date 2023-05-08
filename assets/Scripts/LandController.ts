import { _decorator, Component, instantiate, log, Node, Prefab, UITransform, Vec3, view } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LandController')
export class LandController extends Component {
    @property(Prefab)
    landPrefab: Prefab | null = null;
    speed: number = 150;
    count: number = 0;

    start() {
        if (!this.landPrefab) {
            return;
        }
        this.calcScale();
        this.calcCount();
        this.generateLand();
    }

    update(deltaTime: number) {
        
        if (this.node.children.length === 0) {
            return;
        }

        const distance = this.speed * deltaTime;

        for (const land of this.node.children) {
            this.moveLands(land, distance);
        }

        const firstLand = this.node.children[0];
        const firstLandUIComponent = firstLand.getComponent(UITransform);
        const firstLandPosition = firstLand.getPosition();
        const firstLandWidth = firstLandUIComponent.contentSize.width;
        // 如果第一个背景图已经完全移出屏幕，则销毁
        if (firstLandPosition.x + firstLandWidth < - view.getViewportRect().width / 2) {
            this.distroyLand(firstLand);
            this.addLand();
        }
       
    }

    calcScale() {
        if (!this.landPrefab) {
            return;
        }
        const height = view.getVisibleSize().height;
        const prefabUIComponent = this.landPrefab.data.getComponent(UITransform);
        const prefabHeight = prefabUIComponent.contentSize.height;
        prefabUIComponent.setContentSize(prefabUIComponent.contentSize.width * prefabUIComponent.node.scale.x, prefabUIComponent.contentSize.height * prefabUIComponent.node.scale.y);
    }

    calcCount() {
        const width = view.getViewportRect().width;
        const prefabUIComponent = this.landPrefab?.data.getComponent(UITransform);
        const landWidth = prefabUIComponent.contentSize.width - 2;
        this.count = Math.ceil(width / landWidth) + 2;
    }

    addLand() {
        const land = instantiate(this.landPrefab);
        land.setPosition(this.getNewPosition());
        this.node.addChild(land);
    }


    generateLand() {
        for (let i = 0; i < this.count; i++) {
            this.addLand();
        }
    }


    distroyLand(land: Node) {
        const index = this.node.children.indexOf(land);
        if (index > -1) {
            this.node.removeChild(land);
            land.destroy();
        }
    }

    moveLands(land: Node, distance: number) {
        land.setPosition(land.position.x - distance, land.position.y, land.position.z);
    }

    getNewPosition(): Vec3 {
        if (this.node.children.length === 0) {
            // 屏幕最左边
            const prefab = this.landPrefab?.data;
            return new Vec3(-view.getVisibleSize().width / 2, (prefab.getComponent(UITransform).height * prefab.scale.y + 100) / 2 , 0);
        }
        const lastLand = this.node.children[this.node.children.length - 1];
        const lastLandUIComponent = lastLand.getComponent(UITransform);
        const lastLandPosition = lastLand.getPosition();
        return new Vec3(lastLandPosition.x + (lastLandUIComponent.contentSize.width - 1) * lastLand.scale.x, 0, 0);
    }
}

