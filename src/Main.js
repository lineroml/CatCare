import { Player } from '/Player.js';
import{ Ground } from '/Ground.js';
import { Cat } from './Cat.js';
import { Plate } from './Plate.js';

export class Main extends Phaser.Scene {
    constructor() {
        super({ key: 'main' });
    }

    preload() {
        console.log('estoy en main');
        this.load.image('bg', '/resources/game/BackGround/bg.png');
        this.load.spritesheet('Eli', '/resources/game/Entities/helper.png', {
            frameWidth: 80,
            frameHeight: 150
        });
        this.load.image('logo','/resources/game/logo.png');
        this.load.image('elitxt','/resources/game/Entities/helpertxt.png');

        this.load.image('keyBotton', '/resources/game/nekoKey.png');

        this.plataforms = new Ground(this);
        const name = localStorage.getItem("name");
        this.player = new Player(this);
        this.cats = [new Cat(this,'Charlotto','GREEN'), new Cat(this,'Lion','GREEN')];
        this.plates = [new Plate(this,'WATER',0), new Plate(this,'FOOD',1)];
    }
    create() {
        //imagen de fondo y camara
        var bg = this.add.image(0, 0, 'bg').setOrigin(0, 0);
        this.physics.world.setBounds(0, 0, bg.displayWidth, bg.displayHeight);
        this.cameras.main.setBounds(0, 0, bg.displayWidth, bg.displayHeight);
        //imagen de fondo y camara
        this.add.image(bg.displayWidth/2,bg.displayHeight-400,'logo').setScale(0.3);
        //Creando plataformas
        this.plataforms.create();
        for (let i = 0; i < 7; i++) {
            this.plataforms.addPlataform(500 * i, bg.displayHeight - 32, 'S');
        }
        //Creando plataformas

        this.anims.create({
            key: "eliStay",
            frames: this.anims.generateFrameNumbers("Eli", { start: 0, end: 2 }),
            frameRate: 1.5,
            repeat: -1
        });
        this.txt = this.add.image(bg.displayWidth/4-25,bg.displayHeight-270, 'elitxt');
        this.txt.setScale(0.6);
        this.txt.setOrigin(0.1,0.1);
        this.Eli = this.physics.add.sprite(bg.displayWidth/4,593,'Eli');
        this.Eli.play('eliStay');

        this.key = this.physics.add.image(bg.displayWidth*3/4,bg.displayHeight-100,'keyBotton');
        this.key.setImmovable();
        this.add.text(bg.displayWidth*3/4-100,bg.displayHeight-190,'Vamos a ayudar a los demás\n               \\/',{
            fontSize: '25px',
            fill: '#301717',
            fontFamily: 'pixel'
        });
        this.key.body.allowGravity = false;
        this.plates[0].put(bg.displayWidth/2,bg.displayHeight-100);
        this.plates[0].plate.setOrigin(1,1);
        this.plates[1].put(bg.displayWidth/2,bg.displayHeight-100);
        this.plates[1].plate.setOrigin(0,1);
        this.cats[0].create(bg);
        this.cats[1].create(bg);
        
        //Creando Jugador
        this.player.create(this.plataforms.plat,bg);
        //portales


        

        
        this.physics.add.collider(this.plataforms.plat, this.Eli);
        this.physics.add.collider(this.plataforms.plat, this.key);

        this.physics.add.overlap(this.player.player,this.Eli,()=>{
            this.scene.stop();
            this.scene.start("test");
        },()=>{return this.player.eKey.isDown;},this);

        this.physics.add.overlap(this.player.player,this.key,()=>{
            this.scene.stop();
            this.scene.start("ServerCreator")
        },()=>{return this.player.eKey.isDown;},this);
        //portales

        //Enfocando camara al jugador
        this.cameras.main.startFollow(this.player.player);
        //Enfocando camara al jugador
    }
    update() {
        this.player.update();
        this.cats[0].update();
        this.cats[1].update();
    }
}