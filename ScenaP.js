import { Player } from './Player.js';
import { Shelter } from './Shelter.js';
import { Ground } from './Ground.js';

export class ScenaP extends Phaser.Scene {
    constructor() {
        super({ key: 'principal' });
    }

    preload() {
        this.load.image('bg', './resources/game/bg.png');

        this.plataforms = new Ground(this);

        this.player = new Player(this);

        this.shelter = new Shelter(this);
    }

    create() {
        var bg = this.add.image(0, 0, 'bg').setOrigin(0, 0);
        this.physics.world.setBounds(0, 0, bg.displayWidth, bg.displayHeight);
        this.cameras.main.setBounds(0, 0, bg.displayWidth, bg.displayHeight)


        //Puestos de reabastecimiento
        this.shelter.create();
        this.shelter.addShelter(200, 450, 'FOOD');
        this.shelter.addShelter(300, 450, 'WATER');
        this.shelter.addShelter(400, 450, 'MED');
        this.shelter.addShelter(500, 450, 'FUN');
        //Puestos de reabastecimiento


        //Creando Jugador
        this.player.create();


        //Creando plataformas
        this.plataforms.create();
        this.plataforms.addPlataform(400, 550, 'B');
        this.plataforms.addPlataform(600, 400, 'S');
        //Creando plataformas

        //Enfocando camara al jugador
        this.cameras.main.startFollow(this.player.player);
    }
    update() {
        this.player.update();
    }




}
