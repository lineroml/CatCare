/**
 * Clase que administra las herramientas utilizadas por el jugador
 */
export class Tool {
    /**
     * Crea un objeto Tool en la escena indicada
     * @param {Phaser.Scene} scena 
     */
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

    /**
     * Selecciona la herramienta de Comida
     */
    selectFood() {
        this.selectedTool = 'FOOD';
        this.tool.setTexture('fIcon');
    }

    /**
     * Selecciona la herramienta de Agua
     */
    selectWater() {
        this.selectedTool = 'WATER';
        this.tool.setTexture('wIcon');
    }

    /**
     * Selecciona la herramienta de Medicina
     */
    selectMed() {
        this.selectedTool = 'MED';
        this.tool.setTexture('mIcon');
    }

    /**
     * Selecciona la herramienta de Juguete
     */
    selectFun() {
        this.selectedTool = 'FUN';
        this.tool.setTexture('jIcon');
    }

    /**
     * Desequipa la herramienta seleccionada actualmente
     */
    dropTool() {
        this.selectedTool = undefined;
        this.tool.setTexture('vIcon')
    }
}