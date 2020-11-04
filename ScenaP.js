import {Player} from  './Player.js';

export class ScenaP extends Phaser.Scene{
    constructor(){
        super({key:'principal'});
    }

    preload ()
{
    this.plataforms = this.physics.add.staticGroup();
    this.load.image('plataforma','./resources/game/plat.png');
    this.player = new Player(this);
}

create ()
{
    this.plataforms.create(400,550,'plataforma');
    
    this.player.create();
}
update ()
{
    this.player.update();
}




}
