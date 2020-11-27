/**
 * Clase que contiene la logica detrás de un plato y sus interacciones con el resto de elementos
 * del nivel
 */
export class Plate {
    /**
     * Crea un objeto de tipo Plate en la escena indicada
     * @param {Phaser.Scene} scena Escena donde se posicionan los platos
     * @param {String} tipe Tipo de plato
     * @param {integer} id Id única del plato
     */
    constructor(scena, tipe, id) {
        this.scene = scena;
        this.type = tipe;
        this.ID = id;
        this.scene.load.image('plate', '/resources/game/Entities/plate.png');
        this.scene.load.image('wPlate', '/resources/game/Entities/wPlate.png');
        this.scene.load.image('fPlate', '/resources/game/Entities/fPlate.png');
        this.full = false;
        if (scena.socket != undefined)
            this.scene.socket.emit("plateCreated", { password: scena.socket.id, ID: id, type: tipe, full: false })
    }

    /**
     * Posiciona el plato en las coordenadas dadas
     * @param {integer} x coordenada x del plato 
     * @param {integer} y coordenada y del plato
     */
    put(x, y) {
        this.plate = this.scene.physics.add.image(x, y, 'plate');
        this.scene.physics.add.collider(this.plate, this.scene.plataforms.plat);
    }

    /**
     * Función que contiene la logica detrás de la interacción del jugador con un plato
     * en pos de rellenarlo
     */
    fill() {
        if (!this.full) {
            var t = (this.type == 'FOOD') ? 'fPlate' : 'wPlate';
            this.full = true;
            this.plate.setTexture(t);
            if (this.scene.socket != undefined) {
                this.scene.socket.emit("plateStateC", { ID: this.ID, full: true });
            }
            this.scene.judge.addPoints(10)
            return true;
        }
        return false;
    }

    /**
     * Función que contien la logica destrás de la interaccion del gat con un plato
     * en pos de usar este
     */
    use() {
        this.full = false;
        this.plate.setTexture('plate');
        if (this.scene.socket != undefined) {
            this.scene.socket.emit("plateStateC", { ID: this.ID, full: false });
        }
    }

    /**
     * Función que cambia el estado y la textura del plato según corresponda si está lleno o no
     * @param {Boolean} state Estado del plato
     */
    change(state){
        if(state){
            this.full = true;
            var t = (this.type == 'FOOD') ? 'fPlate' : 'wPlate';
        }else{
            this.full = false;
            var t = 'plate';
        }
        this.plate.setTexture(t);
    }
}