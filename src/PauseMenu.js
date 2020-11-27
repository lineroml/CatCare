/**
 * Escena correspondiente al menú de pausa del juego
 */
export class PauseMenu extends Phaser.Scene{
    constructor(){
        super({key: 'PauseMenu'});
    }

    init(data){
        this.superKey = data.key;
    }

    preload(){
        this.load.image('goToMenu','/resources/game/gotomenu.png');
        this.load.image('pauseMenu', '/resources/game/menu.png');
        this.load.image('continue', '/resources/game/continue.png');
    }

    create(){
        this.background = this.add.image(400,300,'pauseMenu').setScrollFactor(0,0).setVisible(true);
        this.goToStart = this.add.image(220,150,'goToMenu').setScrollFactor(0,0).setScale(0.5,0.5).setVisible(true).setInteractive();
        this.goToStart.on('pointerdown',()=>{
            this.scene.stop(this.superKey);
            this.scene.stop();
            this.scene.start('main');
        });
        this.continue = this.add.image(560,350, 'continue').setScrollFactor(0,0).setScale(0.5,0.5).setVisible(true).setInteractive();
        this.continue.on('pointerdown',()=>{
            this.scene.stop();
            this.scene.resume(this.superKey);
        });
    }
    update(){
        
    }
}