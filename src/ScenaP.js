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

        this.plates = [new Plate(this, 'FOOD', 0), new Plate(this, 'WATER', 1)];

        this.judge = new Judge(this, [10, 10], 100);

        this.cats = [new Cat(this, 'yellow', 'YELLOW'),
        new Cat(this, 'green', 'GREEN'),
        new Cat(this, 'red', 'RED')];
        this.catStates = [];

    }

    create() {
        //imagen de fondo y camara
        var bg = this.add.image(0, 0, 'bg').setOrigin(0, 0);
        this.physics.world.setBounds(0, 0, bg.displayWidth, bg.displayHeight);
        this.cameras.main.setBounds(0, 0, bg.displayWidth, bg.displayHeight);


        //Puestos de reabastecimiento
        this.shelter.create();
        this.shelter.addShelter(200, 715, 'FOOD');
        this.shelter.addShelter(600, 715, 'WATER');
        this.shelter.addShelter(1000, 715, 'MED');
        this.shelter.addShelter(1400, 715, 'FUN');

        //Creando plataformas
        this.plataforms.create();
        for (let i = 0; i < 7; i++) {
            this.plataforms.addPlataform(540 * i, bg.displayHeight - 100, 'B')
        }


        //Platos de agua y comida
        this.plates[0].put(750, 500);
        this.plates[1].put(850, 500);


        //Creando Jugador
        this.player.create(this.plataforms.plat);


        for (let i = 0; i < this.cats.length; i++) {
            var cat = this.cats[i];
            cat.create(bg);
        }

        //Enfocando camara al jugador
        this.cameras.main.startFollow(this.player.player);

        this.judge.create();
    }
    update() {
        this.player.update();
        this.catUpdate();
        this.judge.update();
    }

    catUpdate() {
        for (let i = 0; i < this.catStates.length; i++) {
            var cat = this.catStates[i];
            cat.destroy();
        }
        this.catState = [];
        var num = 0;
        for (let i = 0; i < this.cats.length; i++) {
            var cat = this.cats[i];
            cat.update();
            if (cat.state != 'NORMAL') {
                this.catStates.push(this.add.text(50, 50 + 50 * num, cat.name + ': ' + cat.state, {
                    fontSize: '25px',
                    fill: '#111',
                    fontFamily: 'pixel',
                    backgroundColor: cat.color
                }).setScrollFactor(0, 0));
                num++;
            }
        }
    }


}
