export class Ground {
    constructor(scena) {
        this.amount = -1;
        this.scene = scena;
        this.scene.load.image('B', '/resources/game/Plataforms/plat.png');
        this.scene.load.image('S', '/resources/game/Plataforms/PLAT2.png');
    }

    create() {
        this.plat = this.scene.physics.add.staticGroup();
    }

    addPlataform(x, y, type) {
        this.amount += 1;
        this.plat.create(x, y, type).setOrigin(0, 0);
        var este = this.plat.getChildren()[this.amount];
        este.body.setOffset(este.displayWidth / 2, este.displayHeight / 2);
    }


}