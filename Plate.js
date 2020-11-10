export class Plate{
    constructor(scena,tipe){
        this.scene = scena;
        this.type = tipe;
        this.scene.load.image('plate','./resources/game/Entities/plate.png');
        this.scene.load.image('wPlate','./resources/game/Entities/wPlate.png');
        this.scene.load.image('fPlate','./resources/game/Entities/fPlate.png');
        this.full = false;
    }

    put(x,y){
        this.plate = this.scene.physics.add.image(x,y,'plate');
        this.scene.physics.add.collider(this.plate,this.scene.plataforms.plat);
    }

    fill(){
        var t = (this.type == 'FOOD')? 'fPlate':'wPlate';
        this.full = true;
            this.plate.setTexture(t);
    }

    use(){
        this.full = false;
        this.plate.setTexture('plate');
    }
}