import { Player } from './Player.js';
import { Shelter } from './Shelter.js';
import { Ground } from './Ground.js';
import { Plate } from './Plate.js';

export class ScenaP extends Phaser.Scene {
    constructor() {
        super({ key: 'principal' });
    }

    preload() {
        this.load.image('bg', './resources/game/bg.png');

        this.plataforms = new Ground(this);

        this.player = new Player(this);

        this.shelter = new Shelter(this);

        this.plates = [new Plate(this,'FOOD'),new Plate(this,'WATER')];
    }

    create() {
        //imagen de fondo y camara
        var bg = this.add.image(0, 0, 'bg').setOrigin(0, 0);
        this.physics.world.setBounds(0, 0, bg.displayWidth, bg.displayHeight);
        this.cameras.main.setBounds(0, 0, bg.displayWidth, bg.displayHeight)
        //imagen de fondo y camara


        //Puestos de reabastecimiento
        this.shelter.create();
        this.shelter.addShelter(200, 620, 'MED');
        this.shelter.addShelter(1000, 620, 'FOOD');
        this.shelter.addShelter(900, 620, 'WATER');
        this.shelter.addShelter(1500, 620, 'FUN');
        //Puestos de reabastecimiento


        //Creando plataformas
        this.plataforms.create();
        for (let i = 0; i < 7; i++) {
            this.plataforms.addPlataform(540*i, bg.displayHeight-100, 'B')
        }
        for (let i = 0; i < 3; i++) {
            this.plataforms.addPlataform(544*i+(i+1)*115, bg.displayHeight-220, 'S');
        }
        //Creando plataformas


        //Platos de agua y comida
        this.plates[0].put(1000,500);//comida
        this.plates[1].put(1200,500);//agua
        //Platos de agua y comida


        //Creando Jugador
        this.player.create(this.plataforms.plat);

        
        //Enfocando camara al jugador
        this.cameras.main.startFollow(this.player.player);
        //Enfocando camara al jugador
    }
    update() {
        this.player.update();
    }




}
