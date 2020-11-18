export class Shelter {
    constructor(scena, name, path) {
        this.scene = scena;
        this.name = name;
        this.scene.load.image('comida', '/resources/game/Shelters/food.png');
        this.scene.load.image('agua', '/resources/game/Shelters/water.png');
        this.scene.load.image('botiquin', '/resources/game/Shelters/med.png');
        this.scene.load.image('juguete', '/resources/game/Shelters/fun.png');
    }

    create() {
        this.food = this.scene.physics.add.staticGroup();
        this.water = this.scene.physics.add.staticGroup();
        this.med = this.scene.physics.add.staticGroup();
        this.fun = this.scene.physics.add.staticGroup();
    }

    addShelter(x, y, type) {
        switch (type) {
            case 'FOOD':
                this.food.create(x, y, 'comida');
                break;
            case 'WATER':
                this.water.create(x, y, 'agua');
                break;
            case 'MED':
                this.med.create(x, y, 'botiquin');
                break;
            case 'FUN':
                this.fun.create(x, y, 'juguete');
                break
        }

    }
}


