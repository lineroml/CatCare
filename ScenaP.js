import { Player } from './Player.js';
import { Shelter } from './Shelter.js';

export class ScenaP extends Phaser.Scene {
    constructor() {
        super({ key: 'principal' });
    }

    preload() {
        this.plataforms = this.physics.add.staticGroup();
        this.load.image('plataforma', './resources/game/plat.png');

        this.player = new Player(this);

        this.shelter = new Shelter(this);
    }

    create() {
        //Puestos de reabastecimiento
        this.shelter.create();
        this.shelter.addShelter(200, 450, 'FOOD');
        this.shelter.addShelter(300, 450, 'WATER');
        this.shelter.addShelter(400, 450, 'MED');
        this.shelter.addShelter(500, 450, 'FUN');
        //Puestos de reabastecimiento

        this.plataforms.create(400, 550, 'plataforma');


        this.player.create();
    }
    update() {
        this.player.update();
    }




}
