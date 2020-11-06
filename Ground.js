export class Ground {
    constructor(scena) {
        this.amount = -1;
        this.scene = scena;
        this.scene.load.image('B', './resources/game/plat.png');
        this.scene.load.image('S', './resources/game/PLAT2.png');
    }

    create() {
        this.plat = this.scene.physics.add.staticGroup();
        this.scene.physics.add.collider(this.plat, this.scene.player.player, this.scene.player.movement, null, this.scene.player);
    }

    addPlataform(x, y, type) {
        this.amount += 1;
        this.plat.create(x, y, type).setOrigin(0,0);
    }


}