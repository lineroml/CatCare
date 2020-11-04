export class Player{
    constructor(scena){
        this.scene = scena;
        this.scene.load.image('player','./resources/game/player.png');
        this.cursors = scena.input.keyboard.createCursorKeys();
        this.cKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
    }

    create(){
        this.player = this.scene.physics.add.image(50,0,'player');
        this.player.setCollideWorldBounds(true);
        this.scene.physics.add.collider(this.scene.plataforms,this.player,this.movement,null,this);
    }

    update(){
    }

    movement(){
        if(this.cKey.isUp){
            if(this.cursors.up.isDown){
                this.player.setVelocityY(-250);//puede saltar 100px
            }
            if(this.cursors.left.isDown){
                this.player.setVelocityX(-125);
            }else if(this.cursors.right.isDown){
                this.player.setVelocityX(125);
            }else{
                this.player.setVelocityX(0);
            }
    }else {
            if(this.cursors.left.isDown){
                this.player.setVelocityX(-62);
            }else if(this.cursors.right.isDown){
                this.player.setVelocityX(62);
            }else{
                this.player.setVelocityX(0);
            }
    }
    }

}