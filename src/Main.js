import { Player } from '/Player.js';
import{ Ground } from '/Ground.js';

export class Main extends Phaser.Scene {
    constructor() {
        super({ key: 'main' });
    }

    preload() {
        this.load.image('bg', '/resources/game/BackGround/bg.png');

        this.load.image('multiP', '/resources/game/portal1.png');
        this.load.image('singleP', '/resources/game/portal2.png');

        this.plataforms = new Ground(this);

        this.player = new Player(this);
    }
    create() {
        //imagen de fondo y camara
        var bg = this.add.image(0, 0, 'bg').setOrigin(0, 0);
        this.physics.world.setBounds(0, 0, bg.displayWidth, bg.displayHeight);
        this.cameras.main.setBounds(0, 0, bg.displayWidth, bg.displayHeight);
        //imagen de fondo y camara

        //Creando plataformas
        this.plataforms.create();
        for (let i = 0; i < 7; i++) {
            this.plataforms.addPlataform(540 * i, bg.displayHeight - 100, 'B')
        }
        //Creando plataformas

        //Creando Jugador
        this.player.create(this.plataforms.plat);

        //portales


        this.sp = this.physics.add.image(100,705,'singleP').setScale(0.5);




        this.mp = this.physics.add.image(500,705,'multiP').setScale(0.5);

        
        this.physics.add.collider(this.plataforms.plat, this.sp);
        this.physics.add.collider(this.plataforms.plat, this.mp);

        this.physics.add.overlap(this.player.player,this.sp,()=>{
            this.scene.stop();
            this.scene.start("test");
        },()=>{return this.player.eKey.isDown;},this);

        this.physics.add.overlap(this.player.player,this.mp,()=>{
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
    }
}