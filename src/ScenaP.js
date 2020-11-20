import { Player } from '/Player.js';
import { Shelter } from '/Shelter.js';
import { Ground } from '/Ground.js';
import { Plate } from '/Plate.js';
import { Judge } from '/Judge.js';
import { Cat } from '/Cat.js';

export class ScenaP extends Phaser.Scene {
    constructor() {
        super({ key: 'test' });
    }

    preload() {
        this.load.image('bg', '/resources/game/BackGround/bg.png');
        this.load.image('zoneRed', '/resources/game/Entities/Cats/zoneRed.png');
        this.load.image('zoneYellow', '/resources/game/Entities/Cats/zoneYellow.png');

        this.plataforms = new Ground(this);

        this.player = new Player(this);

        this.shelter = new Shelter(this);

        this.plates = [new Plate(this, 'FOOD',0), new Plate(this, 'WATER',1)];

        this.judge = new Judge(this, [1, 10], 100);

        this.cat = new Cat(this,'yellow','YELLOW');

    }

    create() {
        //imagen de fondo y camara
        var bg = this.add.image(0, 0, 'bg').setOrigin(0, 0);
        this.physics.world.setBounds(0, 0, bg.displayWidth, bg.displayHeight);
        this.cameras.main.setBounds(0, 0, bg.displayWidth, bg.displayHeight);


        //Puestos de reabastecimiento
        this.shelter.create();
        this.shelter.addShelter(200, 515, 'MED');
        this.shelter.addShelter(1300, 515, 'FOOD');
        this.shelter.addShelter(900, 515, 'WATER');
        this.shelter.addShelter(1600, 515, 'FUN');


        //Creando plataformas
        this.plataforms.create();
        for (let i = 0; i < 7; i++) {
            this.plataforms.addPlataform(540 * i, bg.displayHeight - 100, 'B')
        }
        for (let i = 0; i < 3; i++) {
            this.plataforms.addPlataform(544 * i + (i + 1) * 130, bg.displayHeight - 300, 'S');
        }


        //Platos de agua y comida
        this.plates[0].put(1000, 500);//comida
        this.plates[1].put(1200, 500);//agua


        //Creando Jugador
        this.player.create(this.plataforms.plat);


        this.cat.create(bg);

        //Enfocando camara al jugador
        this.cameras.main.startFollow(this.player.player);

        this.judge.create();
    }
    update() {
        this.player.update();
        this.cat.update();
    }


}
