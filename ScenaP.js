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
        //imagen de fondo y camara
        var bg = this.add.image(0, 0, 'bg').setOrigin(0, 0);
        this.physics.world.setBounds(0, 0, bg.displayWidth, bg.displayHeight);
        this.cameras.main.setBounds(0, 0, bg.displayWidth, bg.displayHeight)
        //imagen de fondo y camara

        //Puestos de reabastecimiento
        this.shelter.create();
        this.shelter.addShelter(200, 600, 'MED');
        this.shelter.addShelter(1000, 600, 'FOOD');
        this.shelter.addShelter(900, 600, 'WATER');
        this.shelter.addShelter(1500, 600, 'FUN');
        //Puestos de reabastecimiento


        //Creando Jugador
        this.player.create();


        //Creando plataformas
        this.plataforms.create();
        for (let i = 0; i < 2; i++) {
            this.plataforms.addPlataform(800*i, bg.displayHeight-100, 'B')
        }
        for (let i = 0; i < 3; i++) {
            this.plataforms.addPlataform(600*i+(i+1)*70, bg.displayHeight-220, 'S');
        }
        //Creando plataformas

        
        //Enfocando camara al jugador
        this.cameras.main.startFollow(this.player.player);
        //Enfocando camara al jugador
    }
    update() {
        this.player.update();
    }




}
