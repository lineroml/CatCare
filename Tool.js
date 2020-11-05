export class Tool {
    constructor(scena) {
        this.scene = scena;
        this.selectedTool = undefined;
    }

    create(player) {

    }

    selectFood() {
        this.selectedTool = 'FOOD';
    }

    selectWater() {
        this.selectedTool = 'WATER';
    }

    selectMed() {
        this.selectedTool = 'MED';
    }

    selectFun() {
        this.selectedTool = 'FUN';
    }

    dropTool() {
        this.selectedTool = undefined;
    }
}