/**
 * Clase que administra la creación e interacción de las plataformas con el resto de los objetos
 */
export class Ground {
    /**
     * Crea un objeto Ground para administrar las platafromas en la escena indicada
     * @param {Phaser.Scene} scena 
     */
    constructor(scena) {
        this.amount = -1;
        this.scene = scena;
        this.scene.load.image('SS', '/resources/game/Plataforms/plat.png');
        this.scene.load.image('S', '/resources/game/Plataforms/PLAT2.png');
    }

    create() {
        this.plat = this.scene.physics.add.staticGroup();
    }

    /**
     * Añade una plataforma al nivel
     * @param {integer} x coordenada x de la plataforma
     * @param {integer} y coordenada y de la plataforma
     * @param {String} type tipo de plataforma a agregar
     */
    addPlataform(x, y, type) {
        this.amount += 1;
        this.plat.create(x, y, type).setOrigin(0, 0);
        var este = this.plat.getChildren()[this.amount];
        este.body.setOffset(este.displayWidth / 2, este.displayHeight / 2);
    }


}