/**
 * Escena que corresponde a la pantalla final donde se indica al ganador del juego multijugador
 */
export class Winner extends Phaser.Scene{
    
    constructor(){
        
        super({key: 'Winner'})
    }
    init(data){
        this.superS = data.scene;
        this.winner = data.name;
    }

    preload(){
        this.load.image('win','/resources/game/winner.png');
    }

    create(){
        var a = this.add.image(0,0,'win').setInteractive();
        a.setOrigin(0,0);
        this.add.text(300,190,this.winner,{
            fontSize: '80px',
            fill: '#FFFFFF',
            fontFamily: 'pixel'
        })
        a.on('pointerdown',()=>{
            this.scene.stop(this.superS);
            this.scene.stop();
            this.scene.start('main')
        })
    }
}