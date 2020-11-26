export class Tool {
    constructor(scena) {
        this.scene = scena;
        this.selectedTool = undefined;
        this.scene.load.image('wIcon','/resources/game/Shelters/agua.png');
        this.scene.load.image('fIcon','/resources/game/Shelters/comida.png');
        this.scene.load.image('mIcon','/resources/game/Shelters/medicina.png');
        this.scene.load.image('jIcon','/resources/game/Shelters/juguete.png');
        this.scene.load.image('vIcon', '/resources/game/Shelters/void.png');
    }

    create(){
        this.tool = this.scene.add.image(700,100,'vIcon');
        this.tool.setScrollFactor(0,0);
    }

    selectFood() {
        this.selectedTool = 'FOOD';
        this.tool.setTexture('fIcon');
    }

    selectWater() {
        this.selectedTool = 'WATER';
        this.tool.setTexture('wIcon');
    }

    selectMed() {
        this.selectedTool = 'MED';
        this.tool.setTexture('mIcon');
    }

    selectFun() {
        this.selectedTool = 'FUN';
        this.tool.setTexture('jIcon');
    }

    dropTool() {
        this.selectedTool = undefined;
        this.tool.setTexture('vIcon')
    }
}